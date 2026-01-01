// api/cron/ticketSender.cron.js
const cron = require("node-cron");
const ticketCronService = require("../services/fe/cronTicketSender.service");

module.exports = () => {
  // setiap 5 menit
  cron.schedule("*/5 * * * *", async () => {
    try {
      console.log("⏱️ Cron: Sending scheduled tickets...");
      await ticketCronService.sendTickets();
    } catch (err) {
      console.error("Cron error:", err);
    }
  });
};
