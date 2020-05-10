const { createLogger, format, transports } = require("winston");
const moment = require("moment")
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${moment(timestamp)} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(label({ label: "right meow! 😸" }), timestamp(), myFormat),
  transports: [new transports.Console()]
});

module.exports = logger;
