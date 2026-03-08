// services/dash/payout.service.js
const {
    Payouts,
    CreatorFinancials,
    CreatorBankAccounts,
    Order,
    Payment,
} = require("../../../models");

const { Op } = require("sequelize");
const { toWIB } = require("../../utils/wib");

// ================================
// Helper: Normalisasi amount
// ================================
function normalizeAmount(raw) {
    if (!raw) return 0;
    // hanya angka 0-9
    return Number(String(raw).replace(/[^0-9]/g, ""));
}

module.exports = {

    // ================================
    // 🔥 DASHBOARD
    // ================================
    async getDashboard(creator_id) {
        let fin = await CreatorFinancials.findOne({ where: { creator_id } });
        const bank = await CreatorBankAccounts.findOne({ where: { creator_id } });

        // Jika belum ada CreatorFinancials → generate dari total order paid
        if (!fin) {
            const totalPaid = await Order.sum("organizer_net_total", {
                where: { creator_id, status: "paid" }
            });

            fin = await CreatorFinancials.create({
                creator_id,
                total_income: totalPaid || 0,
                total_payout: 0,
                current_balance: totalPaid || 0,
                pending_income: 0
            });
        }

        // Grafik 30 hari
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - 30);

        const paidOrders = await Order.findAll({
            where: {
                creator_id,
                status: "paid",
                created_at: { [Op.between]: [startDate, today] }
            },
            include: [
                {
                    model: Payment,
                    as: "payments",
                    required: true,
                    where: { status: "paid" }
                }
            ],
            order: [["created_at", "ASC"]],
        });

        const chartMap = {};

        for (const order of paidOrders) {
            const day = toWIB(order.created_at).slice(0, 10);
            if (!chartMap[day]) chartMap[day] = 0;
            chartMap[day] += Number(order.buyer_pay_total);
        }

        const chart = Object.keys(chartMap).map(d => ({
            date: d,
            amount: chartMap[d]
        }));

        return {
            bank,
            balance: Number(fin.current_balance),
            total_payout: Number(fin.total_payout),
            total_income: Number(fin.total_income),
            chart
        };
    },

    // ================================
    // HISTORY
    // ================================
    async getPayoutHistory(creator_id) {
        return await Payouts.findAll({
            where: { creator_id },
            order: [["created_at", "DESC"]],
        });
    },

    // ================================
    // 🔥 CREATE PAYOUT (FIXED)
    // ================================
    async createPayout(creator_id, amount) {
        const fin = await CreatorFinancials.findOne({ where: { creator_id } });
        if (!fin) throw new Error("Financial record not found");

        if (Number(fin.current_balance) < Number(amount))
            throw new Error("Insufficient balance");

        // Kurangi saldo langsung saat request
        fin.current_balance -= Number(amount);
        fin.total_payout += Number(amount);
        await fin.save();

        return await Payouts.create({
            creator_id,
            amount,
            status: "REQUESTED"
        });

    },

    // ================================
    // 🔥 DECREASE INCOME (Refund / Expired)
    // ================================
    async decreaseIncome(order_id, trx = null) {
        const order = await Order.findOne({
            where: { id: order_id },
            transaction: trx
        });

        if (!order) return;

        const fin = await CreatorFinancials.findOne({
            where: { creator_id: order.creator_id },
            transaction: trx,
            lock: trx?.LOCK?.UPDATE
        });

        if (!fin) return;

        const loss = Number(order.organizer_net_total);

        fin.total_income = Math.max(0, Number(fin.total_income) - loss);
        fin.current_balance = Math.max(0, Number(fin.current_balance) - loss);

        await fin.save({ transaction: trx });
    }
};
