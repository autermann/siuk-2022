const {
  TTN_APPLICATION_ID = "hsbo-sensor-comm-2022",
  TTN_TENANT_ID = "ttn",
  TTN_DEVICE_ID,
  TTN_PASSWORD,
  TTN_ENDPOINT,
  THING_ID = DEVICE_ID,
  THING_NAME = THING_ID,
  THING_DESCRIPTION = THING_NAME,
  STA_HTTP_ENDPOINT = "http://localhost/sta",
  STA_MQTT_ENDPOINT = "mqtt://localhost:1883",
  SENSOR_ID = THING_ID,
  SENSOR_NAME = `Sensor of ${THING_ID}`,
  SENSOR_DESCRIPTION = SENSOR_NAME,
  SENSOR_ENCODING_TYPE,
  SENSOR_METADATA,
  FEATURE_OF_INTEREST_ID = THING_ID,
  FEATURE_OF_INTEREST_NAME = `Feature of Interest of ${THING_ID}`,
  FEATURE_OF_INTEREST_DESCRIPTION = FEATURE_OF_INTEREST_NAME,
  LOCATION_ID = THING_ID,
  LOCATION_NAME = `Location of ${THING_ID}`,
  LOCATION_DESCRIPTION = LOCATION_NAME,
  POSITION,
} = process.env;

module.exports = {
  mqtt: {
    connectOptions: { clean: true, connectTimeout: 4000 },
    publishOptions: { qos: 1 },
  },
  ttn: {
    applicationId: TTN_APPLICATION_ID,
    tenantId: TTN_TENANT_ID,
    password: TTN_PASSWORD,
    endpoint: TTN_ENDPOINT,
    deviceId: TTN_DEVICE_ID,
  },
  thing: {
    id: THING_ID,
    name: THING_NAME,
    description: THING_DESCRIPTION,
  },
  featureOfInterest: {
    id: FEATURE_OF_INTEREST_ID,
    name: FEATURE_OF_INTEREST_NAME,
    description: FEATURE_OF_INTEREST_DESCRIPTION,
  },
  location: {
    id: LOCATION_ID,
    name: LOCATION_NAME,
    description: LOCATION_DESCRIPTION,
  },
  sta: {
    http: STA_HTTP_ENDPOINT,
    mqtt: STA_MQTT_ENDPOINT,
  },
  sensor: {
    id: SENSOR_ID || THING_ID,
    name: SENSOR_NAME,
    description: SENSOR_DESCRIPTION,
    encodingType: SENSOR_ENCODING_TYPE,
    metadata: SENSOR_METADATA,
  },
  position: POSITION.split(",").map(parseFloat),
  props: {
    TempC_SHT: {
      id: "air-temperature",
      name: "Air Temperature",
      description: "Air Temperature",
      definition: "http://vocab.nerc.ac.uk/collection/P07/current/CFSN0023/",
      unit: {
        name: "Degrees Celsius",
        definition: "https://vocab.nerc.ac.uk/collection/P06/current/UPAA/",
        symbol: "°C",
      },
      observationType:
        "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
      threshold: { lower: undefined, upper: undefined },
    },
    BatV: {
      id: "battery-voltage",
      name: "Battery Voltage",
      description: "Battery Voltage",
      definition: "https://vocab.nerc.ac.uk/collection/P01/current/BTVOLTCM/",
      unit: {
        name: "Volts",
        definition: "http://vocab.nerc.ac.uk/collection/P06/current/UVLT/",
        symbol: "V",
      },
      observationType:
        "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
      threshold: { lower: undefined, upper: undefined },
    },
    Hum_SHT: {
      id: "relative-humidity",
      name: "Relative Humidity",
      description: "Relative Humidity",
      definition: "http://vocab.nerc.ac.uk/collection/P07/current/CFSN0413/",
      unit: {
        name: "Percent",
        definition: "http://vocab.nerc.ac.uk/collection/P06/current/UPCT/",
        symbol: "%",
      },
      observationType:
        "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
      threshold: { lower: undefined, upper: undefined },
    },
  },
};
