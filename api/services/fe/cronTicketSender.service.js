const { Ticket, TicketType, Event, Creator } = require("../../../models");
const { Op } = require("sequelize");

const promisePool = require("../../utils/promisePool");
const generateTicketPDF = require("../../utils/ticketPdfGenerator");
const sendEmail = require("../../../utils/sendEmailSES");
const buildTicketEmail = require("../../utils/ticketEmailTemplate");

const LIMIT = 500;      // ambil tiket per query
const CONCURRENCY = 6;  // worker paralel

module.exports = {

  async sendTickets() {

    const now = new Date();

    console.log("⏱️ Cron: Sending scheduled tickets...");

    const tickets = await Ticket.findAll({

      where: {
        status: "issued",
        sent_at: null
      },

      include: [
        {
          model: TicketType,
          as: "ticket_type",
          required: true,
          where: {
            deliver_ticket: { [Op.lte]: now }
          }
        },
        {
          model: Event,
          as: "event",
          required: true
        },
        {
          model: Creator,
          as: "creators",
          attributes: ["name"]
        }
      ],

      limit: LIMIT

    });

    if (!tickets.length) {

      console.log("No tickets to send");
      return;

    }

    console.log(`Found ${tickets.length} tickets`);

    await promisePool(

      tickets,

      async (ticket) => {

        try {

          // ======================
          // Generate PDF
          // ======================

          const pdfBuffer = await generateTicketPDF({
            ticket,
            event: ticket.event,
            ticketType: ticket.ticket_type,
            promoter: ticket.creators?.name
          });

          // ======================
          // Build Email HTML
          // ======================

          const html = buildTicketEmail({
            name: ticket.owner_name,
            eventName: ticket.event.name,
            eventDate: ticket.event.date_start,
            eventLocation: ticket.event.location
          });

          // ======================
          // Send Email
          // ======================
          const names = ticket.ticket_code;
          await sendEmail(
            ticket.owner_email,
            `🎫 Tiket Anda - ${ticket.event.name}`,
            html,
            pdfBuffer,
            names
          );

          // ======================
          // Update Ticket
          // ======================

          await ticket.update({
            status: "sent",
            sent_at: new Date()
          });

          console.log("Ticket sent:", ticket.ticket_code);

        } catch (err) {

          console.error("Ticket send failed:", ticket.ticket_code);
          console.error(err);

        }

      },

      CONCURRENCY

    );

  }

};