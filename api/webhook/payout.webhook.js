// webhook/payout.webhook.js

const { Payouts, CreatorFinancials } = require("../../models");

module.exports = {
  async payoutWebhook(req, res) {
    try {
      const event = req.body;

      // Lookup payout record
      const payout = await Payouts.findOne({
        where: { xendit_disbursement_id: event.data.id }
      });

      if (!payout) return res.json({ received: true });

      if (event.event === "disbursement.completed") {
        payout.status = "COMPLETED";
        await payout.save();
      }

      if (event.event === "disbursement.failed") {
        payout.status = "FAILED";
        payout.failure_reason = event.data.failure_code;

        // Refund saldo creator
        const fin = await CreatorFinancials.findOne({
          where: { creator_id: payout.creator_id }
        });

        fin.current_balance += Number(payout.amount);
        fin.total_payout -= Number(payout.amount);
        await fin.save();

        await payout.save();
      }

      return res.json({ received: true });
    } catch (err) {
      return res.json({ received: true });
    }
  }
};