const { Ticket, OrderItem, TicketType } = require("../../../models");
const crypto = require("crypto");

module.exports = {
  async generateTickets(orderId, transaction) {
    const items = await OrderItem.findAll({
      where: { order_id: orderId },
      include: [{ model: TicketType, as: "ticket_type" }],
      transaction,
    });

    for (const item of items) {
      if (!item.attendees) {
        throw new Error("Attendees data missing");
      }

      const attendees = Array.isArray(item.attendees)
        ? item.attendees
        : JSON.parse(item.attendees);

      for (const a of attendees) {
        await Ticket.create(
          {
            order_id: orderId,
            event_id: item.ticket_type.event_id,
            ticket_type_id: item.ticket_type_id,

            ticket_code: "TIX-" + crypto.randomBytes(6).toString("hex"),

            owner_name: a.name,
            owner_email: a.email,
            owner_phone: a.phone,
            type_identity: a.type_identity,
            no_identity: a.no_identity,

            qr_payload: JSON.stringify({
              ticket_code: crypto.randomBytes(6).toString("hex"),
              order_id: orderId,
            }),

            status: "issued",
            issued_at: new Date(),
          },
          { transaction }
        );
      }
    }
  }
};
