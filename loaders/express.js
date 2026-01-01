const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const routes = require("../api/routes");
const logger = require("../config/logger");
const errorHandler = require("../api/middlewares/error.middleware");
const sanitize = require('../api/middlewares/xss.middleware');
const path = require("path");

module.exports = () => {
  const app = express();
  app.post(
    "/api/xendit-callback",
    express.json({ limit: "1mb" }),
    require("../api/controllers/fe/paymentCallback.controller").xenditCallback
  );

  app.use(helmet());

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(",") || "*",
      credentials: true,
    })
  );

  app.use((req, res, next) => {
    if (req.originalUrl === "/api/xendit-callback") {
      return express.json({ limit: "10kb" })(req, res, next);
    }
    return express.json({
      limit: "10kb",
      verify: (req, res, buf) => {
        JSON.parse(buf);
      },
    })(req, res, next);
  });


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
  app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

  app.use(errorHandler);

  return app;
};
