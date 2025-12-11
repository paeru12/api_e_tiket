const logger = require("../../config/logger");

module.exports = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    logger.warn("Validation failed");

    return res.status(400).json({
      status: false,
      message: "Validation error",
      errors: error.details.map((d) => d.message),
    });
  }
  next();
};
