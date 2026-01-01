require("dotenv").config();
const expressLoader = require("./loaders/express");
const sequelizeLoader = require("./loaders/sequelize");
const logger = require("./config/logger");

const startTicketCron = require("./api/cron/ticketSender.cron");
async function startServer() {
  await sequelizeLoader();

  const app = expressLoader();
  const PORT = process.env.PORT || 3000;
  await startTicketCron();
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
  });
}

startServer();
