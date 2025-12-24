const { Order, OrderItem, TicketType, CustomerUser } = require("../../models");
const { Op } = require("sequelize");
const { v4: uuid } = require("uuid");

module.exports = {
  async checkout(data) {
    const {
      customer_name,
      customer_email,
      customer_phone,
      type_identity,
      no_identity,
      items, // [{ ticket_type_id, quantity }]
    } = data;

    if (!items || !Array.isArray(items) || items.length === 0)
      throw new Error("Items required");

    // 🔍 find or create customer
    let customer = await CustomerUser.findOne({
      where: { email: customer_email },
    });

    if (!customer) {
      customer = await CustomerUser.create({
        email: customer_email,
        full_name: customer_name,
        phone: customer_phone,
      });
    }

    // START CHECKOUT PROCESS
    let totalAmount = 0;

    for (const item of items) {
      const ticketType = await TicketType.findByPk(item.ticket_type_id);
      if (!ticketType) throw new Error("Ticket type not found");

      const available =
        ticketType.total_stock -
        ticketType.ticket_sold -
        ticketType.reserved_stock;

      if (available < item.quantity)
        throw new Error(`Not enough stock for ${ticketType.name}`);

      // Lock stock
      ticketType.reserved_stock += item.quantity;
      await ticketType.save();

      totalAmount += Number(ticketType.price) * Number(item.quantity);
    }

    // Create order
    const order = await Order.create({
      id: uuid(),
      code_order: "INV-" + Date.now(),
      customer_user_id: customer.id,
      customer_name,
      customer_email,
      customer_phone,
      type_identity,
      no_identity,
      total_amount: totalAmount,
      status: "waiting_payment",
      expired_at: new Date(Date.now() + 15 * 60 * 1000), // 15 min
    });

    // Create order items
    for (const item of items) {
      const ticketType = await TicketType.findByPk(item.ticket_type_id);

      await OrderItem.create({
        id: uuid(),
        order_id: order.id,
        ticket_type_id: ticketType.id,
        quantity: item.quantity,
        unit_price: ticketType.price,
        total_price: ticketType.price * item.quantity,
      });
    }

    return {
      order_id: order.id,
      code_order: order.code_order,
      total_amount: totalAmount,
      expired_at: order.expired_at,
    };
  },
};
