require("dotenv").config();
const expressLoader = require("./loaders/express");
const sequelizeLoader = require("./loaders/sequelize");
const logger = require("./config/logger");
async function startServer() {
  await sequelizeLoader();

  const app = expressLoader();
  const PORT = 3500;
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
  });
}

startServer();
