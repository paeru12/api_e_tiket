const { TicketType, Event, sequelize } = require("../../../models");

module.exports = {

  async getOne(ticketTypeId) {
    return await TicketType.findByPk(ticketTypeId);
  },

  async create(data) {
    const transaction = await sequelize.transaction();

    try {
      // data adalah ARRAY langsung
      const tickets = data.map(t => ({
        ...t,
        event_id: data[0].event_id
      }));

      const created = await TicketType.bulkCreate(tickets, { transaction });

      const allTickets = await TicketType.findAll({
        where: { event_id: data[0].event_id },
        transaction
      });

      const lowestPrice = Math.min(...allTickets.map(t => t.price));

      await Event.update(
        { lowest_price: lowestPrice },
        { where: { id: data[0].event_id }, transaction }
      );

      await transaction.commit();
      return created;

    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async update(ticketTypeId, data) {
    const ticket = await TicketType.findByPk(ticketTypeId);
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
