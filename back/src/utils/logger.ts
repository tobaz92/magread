const { createLogger, transports, format } = require("winston");
require("winston-daily-rotate-file");
const path = require("path");

const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: path.join(__dirname, "../../logs/application-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.File({
      filename: path.join(__dirname, "../../logs/error.log"),
      level: "error",
    }),
    dailyRotateFileTransport,
  ],
});

module.exports = logger;
