const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const routes = require("../api/routes");
const logger = require("../config/logger");
const errorHandler = require("../api/middlewares/error.middleware");
const sanitize = require('../api/middlewares/xss.middleware');

module.exports = () => {
  const app = express();

  app.use(helmet());

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(",") || "*",
      credentials: true,
    })
  );

  app.use(
    express.json({
      limit: "10kb",
      verify: (req, res, buf) => {
        try {
          JSON.parse(buf);
        } catch (err) {
          logger.error("Invalid JSON received");
          throw new Error("Invalid JSON format");
        }
      },
    })
  );

  app.use(express.urlencoded({ extended: true }));

  app.use(sanitize);
  app.use(hpp());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, try again later",
  });
  app.use(limiter);

  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
  });

  app.use("/api", routes);

  app.use(errorHandler);

  return app;
};
