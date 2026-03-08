const {
  Payouts,
  CreatorBankAccounts,
  CreatorFinancials,
  Creator
} = require("../../../../models");

const xenditV2 = require("../../../utils/xenditPayoutV2");
module.exports = {

  async list(req, res) {
    const rows = await Payouts.findAll({
      include: [
        { model: Creator, as: "creator", as: "creator", attributes: ["name"] }
      ],
      order: [["created_at", "DESC"]]
    });

    res.json({ success: true, data: rows });
  },

  async detail(req, res) {
    const payout = await Payouts.findByPk(req.params.id, {
      include: [
        { model: Creator, as: "creator", attributes: ["name"] },
        { model: CreatorBankAccounts, as: "bank_info" }
      ]
    });

    if (!payout) return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, data: payout });
  },

  // =============================================
  // APPROVE → CREATE XENDIT PAYOUT (FIXED)
  // =============================================
  async approve(req, res) {
    try {
      const id = req.params.id;
      const admin = req.user;

      const payout = await Payouts.findByPk(id);
      if (!payout) return res.error("Payout not found");

      if (payout.status !== "REQUESTED")
        return res.error("Payout already processed");

      const bank = await CreatorBankAccounts.findOne({
        where: { creator_id: payout.creator_id }
      });

      if (!bank) return res.error("Creator belum punya data bank");

      // ==========================================
      // 🔥 CREATE DISBURSEMENT (REST API v2)
      // ==========================================
      const resp = await xenditV2.createDisbursement({
        externalID: `payout-${payout.id}`,
        amount: Number(payout.amount),
        bankCode: bank.bank_code,
        accountHolderName: bank.account_holder_name,
        accountNumber: bank.account_number,
        description: "Payout to event creator"
      });

      payout.status = "PENDING";
      payout.xendit_disbursement_id = resp.id;
      payout.approved_by = admin.id;
      payout.approved_at = new Date();
      await payout.save();

      return res.json({
        success: true,
        message: "Payout requested to Xendit (v2)",
        data: resp
      });

    } catch (err) {
      console.error("APPROVE PAYOUT ERROR:", err.response?.data || err);

      return res.json({
        success: false,
        message: "Failed creating payout",
        error: err.response?.data || err.message
      });
    }
  },

  // ============================================
  // REJECT
  // ============================================
  async reject(req, res) {
    try {
      const id = req.params.id;
      const payout = await Payouts.findByPk(id);

      if (!payout) return res.error("Payout not found");

      payout.status = "REJECTED";
      await payout.save();

      // Refund balance
      const fin = await CreatorFinancials.findOne({
        where: { creator_id: payout.creator_id }
      });

      fin.current_balance += Number(payout.amount);
      fin.total_payout -= Number(payout.amount);
      await fin.save();
      res.json({ success: true, message: "Payout rejected" });
    } catch (err) {
      res.json({ success: false, message: err.message });
    }
  },

};
