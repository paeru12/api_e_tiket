require("dotenv").config();
const expressLoader = require("./loaders/express");
const sequelizeLoader = require("./loaders/sequelize");
const logger = require("./config/logger");
const startTicketCron = require("./api/cron/ticketSender.cron");
const startPdfCleanupCron = require("./api/cron/ticketPdfCleanup.cron");
const expireOrderCron = require("./api/cron/expireOrder.cron");
async function startServer() {
  await sequelizeLoader();

  const app = expressLoader();
  const PORT = process.env.PORT || 3000;
  await startTicketCron();
  // await startPdfCleanupCron();
  await expireOrderCron();
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
  });
}

startServer();


// Kalau kamu mau, saya juga bisa tunjukkan cara membuat cache middleware Express supaya semua endpoint GET otomatis cache tanpa menulis kode di service lagi.
// Biasanya bisa membuat seluruh API kamu jauh lebih cepat.

// kamu tadi kan menawarkan itu bagaimana implementasinya 