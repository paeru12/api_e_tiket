// /api/middlewares/error.middleware.js
const logger = require("../../config/logger");

module.exports = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });

  const status = err.statusCode || 500;

  const response = {
    status: false,
    message: err.message || "Internal Server Error",
  };

  // Jangan tampilkan stack di production
  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  res.status(status).json(response);
};
