const { Ticket, TicketType, Event } = require("../../../models");
const generateTicketPDF = require("../../utils/ticketPdfGenerator");
const sendEmail = require("../../../utils/sendEmailSES");

module.exports = {

  async sendTickets() {
    const now = new Date();

    // Ambil tiket yang:
    // - sudah issued
    // - BELUM dikirim
    // - waktu kirim tiket sudah lewat
    const tickets = await Ticket.findAll({
      where: {
        status: "issued"
      },
      include: [
        {
          model: TicketType,
          required: true,
          as: "ticket_type",
          where: {
            deliver_ticket: { $lte: now }
          }
        },
        {
          model: Event,
          required: true,
          as: "event"
        }
      ]
    });

    for (const ticket of tickets) {
      try {
        // Generate PDF (optional simpan sementara / stream)
        const pdfPath = await generateTicketPDF({
          ticket,
          event: ticket.Event,
          ticketType: ticket.TicketType
        });

        // Kirim email
        await sendEmail(
          ticket.owner_email,
          `Tiket Anda - ${ticket.Event.name}`,
          `
            <p>Halo <b>${ticket.owner_name}</b>,</p>
            <p>Tiket Anda untuk acara <b>${ticket.Event.name}</b> sudah tersedia.</p>
            <p>Silakan gunakan tiket terlampir.</p>
          `,
          pdfPath
        );

        // Update status ticket
        ticket.status = "sent";
        await ticket.save();

      } catch (err) {
        console.error("Failed sending ticket:", ticket.id, err);
        // ❗ jangan throw, biar tiket lain tetap jalan
      }
    }

    return {
      sent: tickets.length
    };
  }

};
