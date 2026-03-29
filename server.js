require("dotenv").config();
const http = require("http");
const expressLoader = require("./loaders/express");
const sequelizeLoader = require("./loaders/sequelize");
const logger = require("./config/logger");
const startTicketCron = require("./api/cron/ticketSender.cron");
const startPdfCleanupCron = require("./api/cron/ticketPdfCleanup.cron");
const expireOrderCron = require("./api/cron/expireOrder.cron");
const {
  initSocket
} = require("./utils/socket");
async function startServer() {
  await sequelizeLoader();
  
  const app = expressLoader();
  const server =
  http.createServer(app);
  const io = initSocket(server);
  app.set("io", io);
  const PORT = process.env.PORT || 3000;
  await startTicketCron();
  // await startPdfCleanupCron();
  await expireOrderCron();
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
  });
}

startServer();