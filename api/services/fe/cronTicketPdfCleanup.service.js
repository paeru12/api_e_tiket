const fs = require("fs/promises");
const path = require("path");
const { Ticket } = require("../../../models");

const PDF_DIR = path.join(process.cwd(), "uploads", "tickets");

// hapus PDF > 24 jam
const EXPIRE_HOURS = 24;

module.exports = {
  async cleanup() {
    console.log("🧹 Cron: Cleaning orphan ticket PDFs...");

    let files;
    try {
      files = await fs.readdir(PDF_DIR);
    } catch (err) {
      console.warn("PDF directory not found, skip cleanup");
      return;
    }

    const now = Date.now();
    let deleted = 0;

    for (const file of files) {
      if (!file.endsWith(".pdf")) continue;

      const filePath = path.join(PDF_DIR, file);

      try {
        const stat = await fs.stat(filePath);
        const ageHours = (now - stat.mtimeMs) / (1000 * 60 * 60);

        if (ageHours < EXPIRE_HOURS) continue;

        const ticketCode = file.replace(".pdf", "");

        const ticket = await Ticket.findOne({
          where: { ticket_code: ticketCode },
        });

        // 🔥 RULE HAPUS
        if (!ticket || ticket.status !== "sent") {
          await fs.unlink(filePath);
          deleted++;
          console.log("🗑️ Deleted orphan PDF:", file);
        }
      } catch (err) {
        console.error("Cleanup error:", file, err.message);
      }
    }

    console.log(`🧼 Cleanup finished, deleted ${deleted} file(s)`);
  },
};
