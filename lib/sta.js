const settings = require("./settings");
const axios = require("./axios")

async function createSensor() {
  const { id, name, description, encodingType, metadata } = settings.sensor;
  await axios.post("/Sensors", {
    ...reference(id),
    name,
    description,
    encodingType,
    metadata,
  });
}

async function createObservedProperty({ id, name, description, definition }) {
  await axios.post("/ObservedProperties", {
    ...reference(id),
    name,
    description,
    definition,
  });
}

async function createThing() {
  const { id, name, description } = settings.thing;
  await axios.post("/Things", { ...reference(id), name, description });
}

function createFeature() {
  const { position } = settings;
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: position,
    },
  };
}

async function createLocation() {
  const {
    location: { id, name, description },
    thing: { id: thingId },
  } = settings;
  // UPDATE platform_location SET fk_platform_id = 1 WHERE fk_location_id = 1;
  await axios.post(`/Locations`, {
    ...reference(id),
    name,
    description,
    location: createFeature(),
    Things: [reference(thingId)],
    encodingType: "application/vnd.geo+json",
  });
}

async function createFeatureOfInterest() {
  const { id, name, description } = settings.featureOfInterest;
  await axios.post("/FeaturesOfInterest", {
    ...reference(id),
    name,
    description,
    encodingType: "application/vnd.geo+json",
    feature: createFeature(),
  });
}

function getDatastreamId(prop) {
  return `${settings.thing.id}-${prop}`;
}

async function createDatastream({ id, name, unit, observationType }) {
  const {
    thing: { id: thingId },
    sensor: { id: sensorId },
  } = settings;
  await axios.post("/Datastreams", {
    ...reference(getDatastreamId(id)),
    name: `${name} of ${thingId}`,
    description: `${name} measured by ${thingId}`,
    Thing: reference(thingId),
    unitOfMeasurement: unit,
    observationType: observationType,
    ObservedProperty: reference(id),
    Sensor: reference(sensorId),
  });
}

async function init() {
  const { props } = settings;
  for (const prop of Object.values(props)) {
    await createObservedProperty(prop);
  }
  await createThing();
  await createLocation();
  await createSensor();
  await createFeatureOfInterest();
  for (const prop of Object.values(props)) {
    await createDatastream(prop);
  }
}

function reference(id) {
  return { "@iot.id": id };
}

module.exports = {
  init,
  reference,
  getDatastreamId,
};
