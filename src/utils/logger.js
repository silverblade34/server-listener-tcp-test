const { createLogger, transports, format, config } = require("winston");

const timezoned = () => {
  return new Date().toLocaleString("PE", {
    timeZone: "America/Lima",
  });
};

// const myCustomLevels = {
//   levels: {
//     tramas: 0,
//     info: 1,
//     silly: 2,
//     debug: 3,
//     error: 4,
//   },
//   colors: {
//     tramas: "green",
//     info: "blue",
//     silly: "yellow",
//   },
// };

// levels: config.syslog.levels,
// levels: myCustomLevels.levels,
module.exports = createLogger({
  format: format.combine(
    format.simple(),
    format.timestamp({ format: timezoned }),
    format.printf((info) => `[${info.timestamp}] ${info.level} ${info.message}`)
    // format.splat(),
    // format.json()
  ),
  transports: [
    new transports.File({
      datePattern: "YYYY-MM-DD-HH",
      maxsize: 10 * 1024 * 1024,
      maxFiles: 1,
      filename: `${__dirname}/log-tramas.log`,
      level: "debug",
    }),
    new transports.File({
      datePattern: "YYYY-MM-DD-HH",
      maxsize: 10 * 1024 * 1024,
      maxFiles: 1,
      filename: `${__dirname}/log-errors.log`,
      level: "error",
    }),
    new transports.File({
      datePattern: "YYYY-MM-DD-HH",
      maxsize: 10 * 1024 * 1024,
      maxFiles: 1,
      filename: `${__dirname}/log.log`,
    }),
    new transports.Console({
      datePattern: "YYYY-MM-DD-HH",
      level: "info",
    }),
  ],
});
