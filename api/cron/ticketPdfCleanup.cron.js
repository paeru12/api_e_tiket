const cron = require("node-cron");
const cleanupService = require("../services/fe/cronTicketPdfCleanup.service");

module.exports = async function startPdfCleanupCron() {
  // setiap hari jam 03:00 pagi
  cron.schedule("0 3 * * *", async () => {
    await cleanupService.cleanup();
  });

  console.log("🧹 PDF cleanup cron scheduled (daily 03:00)");
};
