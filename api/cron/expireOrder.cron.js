const cron = require("node-cron");

const expireOrderService = require(
    "../services/fe/expireOrder.service"
);
module.exports = async function expireOrderCron() {
    cron.schedule("*/5 * * * *", async () => {

        await expireOrderService.releaseExpiredOrders();

    });
};