const { createLogger, format, transports } = require("winston");
const { consoleFormat } = require("winston-console-format");
const { combine, timestamp, ms, errors, splat, json, colorize, padLevels } =
  format;
const { Console } = transports;

module.exports = createLogger({
  level: "debug",
  format: combine(timestamp(), ms(), errors({ stack: true }), splat(), json()),
  transports: [
    new Console({
      format: combine(
        colorize({ all: true }),
        padLevels(),
        consoleFormat({
          showMeta: true,
          metaStrip: ["timestamp", "service"],
          inspectOptions: {
            depth: 2,
            colors: true,
            maxArrayLength: Infinity,
            breakLength: 120,
            compact: Infinity,
          },
        })
      ),
    }),
  ],
});
