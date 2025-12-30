const { Ticket, TicketType, Event, Order, OrderItem } = require("../../../models");
const generateTicketPDF = require("../../utils/ticketPdfGenerator");
const sendEmail = require("../../../utils/sendEmailSES");
const crypto = require("crypto");

module.exports = {

  async generateTickets(orderId) {
    const order = await Order.findByPk(orderId);
    if (!order) throw new Error("Order not found");

    const items = await OrderItem.findAll({
      where: { order_id: orderId },
      include: [
        { model: TicketType },
        { model: Event }
      ]
    });

    let ticketsGenerated = [];

    for (const item of items) {
      const ticketType = item.TicketType;
      const event = item.Event;

      const attendees = typeof item.attendees === "string"
        ? JSON.parse(item.attendees)
        : item.attendees;

      if (!attendees || attendees.length === 0) {
        throw new Error("Attendees list missing for ticket type");
      }

      for (const attendee of attendees) {
        const ticket_code = `BL-SNG-${crypto.randomBytes(4).toString("hex")}`;

        const ticket = await Ticket.create({
          order_id: orderId,
          event_id: event.id,
          ticket_type_id: ticketType.id,
          ticket_code: ticket_code,
          owner_name: attendee.full_name,
          owner_email: attendee.email,
          owner_no_wa: attendee.phone,
          type_identity: attendee.type_identity,
          no_identity: attendee.no_identity,
          status: "active"
        });

        const pdfPath = await generateTicketPDF({
          ticket,
          event,
          ticketType
        });

        await sendEmail(
          attendee.email,
          `Tiket Anda - ${event.name}`,
          `<p>Halo <b>${attendee.full_name}</b>,</p>
           <p>Tiket Anda untuk acara <b>${event.name}</b> berhasil dibuat.</p>
           <p>Silakan cek lampiran PDF.</p>`,
          pdfPath
        );

        ticketsGenerated.push(ticket);
      }

      await ticketType.update({
        ticket_sold: ticketType.ticket_sold + attendees.length,
        reserved_stock: ticketType.reserved_stock - attendees.length
      });
    }

    return ticketsGenerated;
  },


  async sendScheduledTickets() {
    const tickets = await Ticket.findAll({
      where: { status: "pending_send" },
      include: [{ model: Event }]
    });

    for (const ticket of tickets) {
      const eventDate = new Date(ticket.Event.date_start);
      const now = new Date();

      const hMinus3 = new Date(eventDate);
      hMinus3.setDate(eventDate.getDate() - 3);

      const shouldSend =
        now >= hMinus3 ||
        ticket.created_at > hMinus3;

      if (shouldSend) {
        await this.sendTicketNow(ticket);
      }
    }
  }

};
