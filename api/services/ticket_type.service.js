const { TicketType, Event } = require("../../models");

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
    // Pastikan event ada
    const event = await Event.findByPk(tickets[0].event_id);
    if (!event) throw new Error("Event not found");

    return await TicketType.bulkCreate(tickets, { returning: true });
  },

  async update(id, data) {
    const ticket = await TicketType.findByPk(id);
    if (!ticket) throw new Error("Ticket type not found");

    await ticket.update(data);
    return ticket;
  },

  async remove(id) {
    const ticket = await TicketType.findByPk(id);
    if (!ticket) throw new Error("Ticket type not found");

    await ticket.destroy();
    return { message: "Ticket deleted" };
  },
};
