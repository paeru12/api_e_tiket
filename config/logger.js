// /config/logger.js
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize, json } = format;
const path = require("path");

// Custom log format untuk console
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(timestamp(), json()),
  transports: [
    // Log error file (rotating)
    new transports.File({
      filename: path.join("logs", "error.log"),
      level: "error",
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
    }),

    // Log activity umum
    new transports.File({
      filename: path.join("logs", "combined.log"),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
});

// Console logging hanya pada development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: combine(colorize(), timestamp(), logFormat),
    })
  );
}

module.exports = logger;
