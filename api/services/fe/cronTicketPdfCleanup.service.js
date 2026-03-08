const fs = require("fs/promises");
const path = require("path");
const { Ticket } = require("../../../models");

const PDF_DIR = path.join(process.cwd(), "uploads", "tickets");

const EXPIRE_HOURS = 24;

module.exports = {

  async cleanup() {

    console.log("🧹 Cron: Cleaning orphan ticket PDFs...");

    let files;

    try {

      files = await fs.readdir(PDF_DIR);

    } catch {

      console.warn("PDF directory not found");

      return;

    }

    // 🔥 ambil tiket sekali saja
    const tickets = await Ticket.findAll({
      attributes: ["ticket_code", "status"]
    });

    const map = {};

    tickets.forEach(t => {
      map[t.ticket_code] = t.status;
    });

    const now = Date.now();
    let deleted = 0;

    for (const file of files) {

      if (!file.endsWith(".pdf")) continue;

      const filePath = path.join(PDF_DIR, file);

      try {

        const stat = await fs.stat(filePath);

        const ageHours =
          (now - stat.mtimeMs) / (1000 * 60 * 60);

        if (ageHours < EXPIRE_HOURS) continue;

        const ticketCode = file.replace(".pdf", "");

        if (!map[ticketCode] || map[ticketCode] !== "sent") {

          await fs.unlink(filePath);

          deleted++;

          console.log("🗑️ Deleted orphan:", file);

        }

      } catch (err) {

        console.error("Cleanup error:", file);

      }

    }

    console.log(`🧼 Cleanup finished: ${deleted}`);

  }

};