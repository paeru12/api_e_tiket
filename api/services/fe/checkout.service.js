const {
  sequelize,
  Order,
  OrderItem,
  TicketType,
  CustomerUser
} = require("../../../models");
const { v4: uuid } = require("uuid");

module.exports = {
  async checkout(payload) {
    const trx = await sequelize.transaction();

    try {
      const { customer, items } = payload;

      if (!items || !items.length) {
        throw new Error("Items required");
      }

      for (const item of items) {
        if (!item.attendees || item.attendees.length !== item.quantity) {
          throw new Error("Attendees count must match quantity");
        }
      }

      // find / create customer
      let customerUser = await CustomerUser.findOne({
        where: { email: customer.email },
        transaction: trx
      });

      if (!customerUser) {
        customerUser = await CustomerUser.create({
          full_name: customer.full_name,
          email: customer.email,
          phone: customer.phone
        }, { transaction: trx });
      }

      let totalAmount = 0;

      // LOCK STOCK
      for (const item of items) {
        const ticketType = await TicketType.findByPk(item.ticket_type_id, {
          transaction: trx,
          lock: trx.LOCK.UPDATE
        });

        if (!ticketType) throw new Error("Ticket type not found");

        const available =
          ticketType.total_stock -
          ticketType.ticket_sold -
          ticketType.reserved_stock;

        if (available < item.quantity) {
          throw new Error(`Stock not enough for ${ticketType.name}`);
        }

        ticketType.reserved_stock += item.quantity;
        await ticketType.save({ transaction: trx });

        totalAmount += Number(ticketType.price) * item.quantity;
      }

      // CREATE ORDER
      const order = await Order.create({
        id: uuid(),
        code_order: `INV-${Date.now()}`,
        event_id: customerUser.event_id,
        customer_id: customerUser.id,
        customer_name: customer.full_name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        type_identity: customer.type_identity,
        no_identity: customer.no_identity,
        total_amount: totalAmount,
        status: "waiting_payment",
        expired_at: new Date(Date.now() + 15 * 60 * 1000)
      }, { transaction: trx });

      // CREATE ORDER ITEMS
      for (const item of items) {
        const ticketType = await TicketType.findByPk(item.ticket_type_id);

        await OrderItem.create({
          id: uuid(),
          order_id: order.id,
          ticket_type_id: ticketType.id,
          quantity: item.quantity,
          unit_price: ticketType.price,
          total_price: ticketType.price * item.quantity,
          attendees: JSON.stringify(item.attendees)
        }, { transaction: trx });
      }

      await trx.commit();

      return {
        order_id: order.id,
        code_order: order.code_order,
        total_amount: totalAmount,
        expired_at: order.expired_at
      };

    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }
};
