const fs = require("fs/promises");
const path = require("path");
const { Ticket, TicketType, Event } = require("../../../models");
const { Op } = require("sequelize");
const generateTicketPDF = require("../../utils/ticketPdfGenerator");
const sendEmail = require("../../../utils/sendEmailSES");

module.exports = {
  async sendTickets() {
    const now = new Date();
    console.log("⏱️ Cron: Sending scheduled tickets...");

    const tickets = await Ticket.findAll({
      where: {
        status: "issued",
        sent_at: null,
      },
      include: [
        {
          model: TicketType,
          as: "ticket_type",
          required: true,
          where: {
            deliver_ticket: {
              [Op.lte]: now,
            },
          },
        },
        {
          model: Event,
          as: "event",
          required: true,
        },
      ],
    });

    console.log(`Found ${tickets.length} tickets to send`);

    for (const ticket of tickets) {
      let pdfPath = null;

      try {
        // 1️⃣ Generate PDF
        pdfPath = await generateTicketPDF({
          ticket,
          event: ticket.event,
          ticketType: ticket.ticket_type,
        });

        // 2️⃣ Send Email + Attachment
        await sendEmail(
          ticket.owner_email,
          `Tiket Anda - ${ticket.event.name}`,
          `
            <p>Halo <b>${ticket.owner_name}</b>,</p>
            <p>Tiket Anda untuk acara <b>${ticket.event.name}</b> sudah tersedia.</p>
            <p>Silakan gunakan QR Code pada tiket terlampir.</p>
          `,
          pdfPath
        );

        // 3️⃣ Update ticket
        await ticket.update({
          status: "sent",
          sent_at: new Date(),
        });

        console.log("✅ Ticket sent:", ticket.ticket_code);

        // 4️⃣ DELETE PDF (🔥 INI YANG KAMU MAU)
        await fs.unlink(pdfPath);
        console.log("🗑️ PDF deleted:", path.basename(pdfPath));
      } catch (err) {
        console.error("❌ Failed sending ticket:", ticket.ticket_code, err);

        // SAFETY:
        // Kalau email gagal → PDF JANGAN DIHAPUS
      }
    }
  },
};
