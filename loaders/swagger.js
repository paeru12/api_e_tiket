const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("../api/config/swagger_output.json");

module.exports = (app) => {
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
};
