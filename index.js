require("dotenv").config();
const { connectAsync } = require("async-mqtt");
const fs = require("fs/promises");
const log = require("./lib/log");
const { init, reference, getDatastreamId } = require("./lib/sta");
const {
  ttn: { applicationId, tenantId, deviceId, password, endpoint: subEndpoint },
  sta: { mqtt: pubEndpoint },
  props,
  mqtt: { connectOptions, publishOptions },
  featureOfInterest: { id: featureOfInterestId },
} = require("./lib/settings");

const { checkThreshold } = require("./lib/alert");

async function persist(topic, message) {
  fs.mkdir(`data/${topic}`, { recursive: true });
  await fs.writeFile(
    `data/${topic}/${new Date().toISOString()}.json`,
    JSON.stringify(message, null, 2)
  );
}

function createObservations(message) {
  const {
    received_at: time,
    uplink_message: { decoded_payload: payload },
  } = message;
  const common = {
    phenomenonTime: time,
    resultTime: time,
    FeatureOfInterest: reference(featureOfInterestId),
  };
  return Object.keys(props).map((key) => {
    const {
      id,
      name,
      unit: { symbol },
      threshold
    } = props[key];
    const result = payload[key];

    const toString = () => `${name} at ${time} is ${result} ${symbol}`;
   

    const Datastream = reference(getDatastreamId(id));
    const observation = { ...common, result, Datastream, toString };

    checkThreshold(observation, threshold);

    return observation;
  });
}

(async function () {
  await init();

  // publisher
  const pub = await connectAsync(pubEndpoint, connectOptions);
  log.info("Connected to %s", pubEndpoint);

  try {
    // receiver
    const sub = await connectAsync(subEndpoint, {
      ...connectOptions,
      username: `${applicationId}@${tenantId}`,
      password,
    });
    try {
      log.info("Connected to %s", subEndpoint);
      const subTopic = `v3/${applicationId}@${tenantId}/devices/${deviceId}/up`;
      await sub.subscribe(subTopic);
      log.info("Subscribed to %s", subTopic);

      sub.on("message", async (topic, message) => {
        // message is a Buffer, parse to Object
        message = JSON.parse(message.toString());
        log.info("Received message on %s", topic);

        await persist(topic, message);

        // transform the message to a set of observations
        const observations = createObservations(message);

        return await Promise.all(
          observations.map(async (observation) => {
            log.info(observation);
            await pub.publish(
              "v1.1/Observations",
              JSON.stringify(observation),
              publishOptions
            );
            log.info("Published observation", observation);
          })
        );
      });
    } catch (e) {
      await sub.end();
      throw e;
    }
  } catch (e) {
    await pub.end();
    throw e;
  }
})().catch(log.error);
