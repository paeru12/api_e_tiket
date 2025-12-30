const { TicketType, Event } = require("../../../models");

module.exports = {
  async getAll(event_id) {
    return await TicketType.findAll({
      where: { event_id },
      order: [["created_at", "DESC"]],
    });
  },

  async getOne(id) {
    return await TicketType.findByPk(id);
  },

  async bulkCreate(tickets) {

    const event = await Event.findByPk(tickets[0].event_id);
    if (!event) throw new Error("Event not found");

    return await TicketType.bulkCreate(tickets, { returning: true });
  },

  async update(id, data) {
    const ticket = await TicketType.findByPk(id);
    if (!ticket) throw new Error("Ticket type not found");

    await ticket.update(data);
    const tickets = await TicketType.findAll({
      where: { event_id: ticket.event_id }
    });

    const lowestPrice = Math.min(...tickets.map(t => t.price));

    await Event.update(
      { lowest_price: lowestPrice },
      { where: { id: ticket.event_id } }
    );
    return ticket;
  },

  async remove(id) {
    const ticket = await TicketType.findByPk(id);
    if (!ticket) throw new Error("Ticket type not found");

    const eventId = ticket.event_id;
    await ticket.destroy();

    const tickets = await TicketType.findAll({ where: { event_id: eventId } });

    const lowestPrice = tickets.length
      ? Math.min(...tickets.map(t => t.price))
      : null;

    await Event.update(
      { lowest_price: lowestPrice },
      { where: { id: eventId } }
    );

    return { message: "Ticket deleted" };
  }

};
