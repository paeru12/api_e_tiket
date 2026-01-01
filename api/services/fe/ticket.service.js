const { Ticket, OrderItem, Event } = require("../../../models");
const crypto = require("crypto");

module.exports = {
  async generateTickets(orderId, transaction) {
    const items = await OrderItem.findAll({
      where: { order_id: orderId },
      transaction
    });

    for (const item of items) {
      const attendees = JSON.parse(item.attendees);

      for (const a of attendees) {
        await Ticket.create({
          order_id: orderId,
          ticket_type_id: item.ticket_type_id,
          ticket_code: crypto.randomBytes(6).toString("hex"),
          owner_name: a.full_name,
          owner_email: a.email,
          owner_phone: a.phone,
          type_identity: a.type_identity,
          no_identity: a.no_identity,
          status: "issued",
          issued_at: new Date()
        }, { transaction });
      }
    }
  }
};
