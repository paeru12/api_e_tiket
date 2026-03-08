const {
    sequelize,
    Order,
    OrderItem,
    TicketType,
    Payment
} = require("../../../models");

const { Op } = require("sequelize");

module.exports = {

    async releaseExpiredOrders() {

        console.log("⏱ Cron: Checking expired orders...");

        const now = new Date();

        const orders = await Order.findAll({
            where: {
                status: "waiting_payment",
                expired_at: {
                    [Op.lte]: now
                }
            },
            limit: 50,
            attributes: ["id"]
        });

        if (!orders.length) {

            console.log("No expired orders");

            return;

        }

        console.log(`Found ${orders.length} expired orders`);

        for (const order of orders) {

            const trx = await sequelize.transaction();

            try {

                const items = await OrderItem.findAll({
                    where: { order_id: order.id },
                    transaction: trx
                });

                const ticketMap = {};

                for (const item of items) {

                    ticketMap[item.ticket_type_id] =
                        (ticketMap[item.ticket_type_id] || 0) + item.quantity;

                }

                for (const ticketTypeId in ticketMap) {

                    await TicketType.decrement(
                        { reserved_stock: ticketMap[ticketTypeId] },
                        {
                            where: { id: ticketTypeId },
                            transaction: trx
                        }
                    );

                }

                await Order.update(
                    { status: "expired" },
                    {
                        where: { id: order.id },
                        transaction: trx
                    }
                );

                await Payment.update(
                    { status: "expired" },
                    {
                        where: { order_id: order.id },
                        transaction: trx
                    }
                );

                await trx.commit();

                console.log("Released stock for order:", order.id);

            } catch (err) {

                await trx.rollback();

                console.error("Release stock error:", order.id);

            }

        }

    }

};