// services/fe/checkout.service.js

const {
  sequelize,
  Event,
  Order,
  OrderItem,
  TicketType,
  CustomerUser,
  CreatorFinanceSettings,
  SystemFinanceSettings
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

      // ==========================
      // VALIDATE ATTENDEES
      // ==========================

      for (const item of items) {

        if (!item.attendees || item.attendees.length !== item.quantity) {
          throw new Error("Attendees must match quantity");
        }

      }

      // ==========================
      // CUSTOMER
      // ==========================

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

      const systemFinance = await SystemFinanceSettings.findOne();
      const TAX_RATE = Number(systemFinance.tax_rate) / 100;

      // ==========================
      // LOAD ALL TICKET TYPES
      // ==========================

      const ticketTypeIds = items.map(i => i.ticket_type_id);

      const ticketTypes = await TicketType.findAll({
        where: { id: ticketTypeIds },
        include: [{ model: Event, as: "event", attributes: ["id", "creator_id"] }],
        transaction: trx,
        lock: trx.LOCK.UPDATE
      });

      const ticketMap = {};
      ticketTypes.forEach(tt => ticketMap[tt.id] = tt);

      // ==========================
      // PRICE VARIABLES
      // ==========================

      let ticketSubtotal = 0;
      let totalAdminFee = 0;
      let totalTax = 0;
      let buyerPayTotal = 0;
      let organizerNetTotal = 0;

      let adminFeeBearer = null;
      let taxBearer = null;

      const computedItems = [];
      let creatorIdFromEvent = null;

      // ==========================
      // LOOP ITEMS
      // ==========================

      for (const item of items) {

        const ticketType = ticketMap[item.ticket_type_id];

        if (!ticketType) {
          throw new Error("Ticket type not found");
        }

        if (!creatorIdFromEvent) {
          creatorIdFromEvent = ticketType.event.creator_id;
        }

        // ==========================
        // MAX PER ORDER
        // ==========================

        if (ticketType.max_per_order && item.quantity > ticketType.max_per_order) {
          throw new Error(
            `Maximum ${ticketType.max_per_order} ticket allowed for ${ticketType.name}`
          );
        }

        const available =
          ticketType.total_stock -
          ticketType.ticket_sold -
          ticketType.reserved_stock;

        if (available < item.quantity) {
          throw new Error(`Stock not enough for ${ticketType.name}`);
        }

        // ==========================
        // RESERVED STOCK
        // ==========================

        await TicketType.increment(
          { reserved_stock: item.quantity },
          {
            where: { id: ticketType.id },
            transaction: trx
          }
        );

        const qty = item.quantity;
        const price = Number(ticketType.price);

        const itemTicketSubtotal = price * qty;

        ticketSubtotal += itemTicketSubtotal;

        // ==========================
        // ADMIN FEE
        // ==========================

        const creatorFinance = await CreatorFinanceSettings.findOne({
          where: { creator_id: ticketType.event.creator_id }
        });

        let adminFeeSingle = 0;

        if (creatorFinance.admin_fee_type === "flat") {
          adminFeeSingle = Number(creatorFinance.admin_fee_value);
        } else {
          adminFeeSingle = price * (Number(creatorFinance.admin_fee_value) / 100);
        }

        const itemAdminFee = adminFeeSingle * qty;
        const itemTax = price * TAX_RATE * qty;

        const buyerPaysAdmin = ticketType.admin_fee_included == 1;
        const buyerPaysTax = ticketType.tax_included == 1;

        adminFeeBearer = resolveBearer(adminFeeBearer, buyerPaysAdmin);
        taxBearer = resolveBearer(taxBearer, buyerPaysTax);

        let itemBuyerPay = itemTicketSubtotal;
        let itemOrganizerNet = itemTicketSubtotal;

        if (buyerPaysAdmin) itemBuyerPay += itemAdminFee;
        else itemOrganizerNet -= itemAdminFee;

        if (buyerPaysTax) itemBuyerPay += itemTax;
        else itemOrganizerNet -= itemTax;

        totalAdminFee += itemAdminFee;
        totalTax += itemTax;

        buyerPayTotal += itemBuyerPay;
        organizerNetTotal += itemOrganizerNet;

        computedItems.push({
          ticketType,
          qty,
          ticket_price: price,
          itemAdminFee,
          itemTax,
          itemBuyerPay,
          itemOrganizerNet,
          attendees: item.attendees
        });

      }

      if (!adminFeeBearer) adminFeeBearer = "buyer";
      if (!taxBearer) taxBearer = "buyer";

      // ==========================
      // CREATE ORDER
      // ==========================

      const random4 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(2, 12);

      const codeOrder = `${timestamp}-${random4}`;

      const order = await Order.create({
        id: uuid(),
        creator_id: creatorIdFromEvent,
        code_order: codeOrder,

        customer_id: customerUser.id,
        customer_name: customer.full_name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        type_identity: customer.type_identity,
        no_identity: customer.no_identity,

        ticket_subtotal: ticketSubtotal,
        admin_fee_amount: totalAdminFee,
        tax_amount: totalTax,

        buyer_pay_total: buyerPayTotal,
        organizer_net_total: organizerNetTotal,

        admin_fee_bearer: adminFeeBearer,
        tax_bearer: taxBearer,

        status: "waiting_payment",
        expired_at: new Date(Date.now() + 15 * 60 * 1000)

      }, { transaction: trx });

      // ==========================
      // ORDER ITEMS
      // ==========================

      const orderItemsPayload = computedItems.map(data => ({

        id: uuid(),
        order_id: order.id,
        ticket_type_id: data.ticketType.id,
        quantity: data.qty,

        ticket_price: data.ticket_price,
        admin_fee_amount: data.itemAdminFee,
        tax_amount: data.itemTax,

        buyer_pay_amount: data.itemBuyerPay,
        organizer_net: data.itemOrganizerNet,

        attendees: data.attendees

      }));

      await OrderItem.bulkCreate(orderItemsPayload, { transaction: trx });

      await trx.commit();

      return {
        order_id: order.id,
        code_order: order.code_order,
        buyer_pay_total: buyerPayTotal,
        expired_at: order.expired_at
      };

    } catch (err) {

      await trx.rollback();
      throw err;

    }

  }

};

function resolveBearer(current, buyerPays) {

  if (current == null) return buyerPays ? "buyer" : "organizer";

  if (current === "mixed") return "mixed";

  if (current === "buyer" && !buyerPays) return "mixed";
  if (current === "organizer" && buyerPays) return "mixed";

  return current;

}