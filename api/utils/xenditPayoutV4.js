// utils/xenditPayoutV4.js
const axios = require("axios");

const client = axios.create({
  baseURL: "https://api.xendit.co/payouts",
  auth: { username: process.env.XENDIT_SECRET_KEY, password: "" },
  headers: {
    "Content-Type": "application/json"
  }
});

module.exports = {
  async createPayout({ reference_id, amount, bank }) {

    const payload = {
      reference_id,
      amount: Number(amount),
      currency: "IDR",
      channel_code: bank.code,
      channel_properties: {
        account_number: bank.number,
        account_holder_name: bank.holder
      },
      description: `Payout for ${reference_id}`
    };

    const resp = await client.post("/", payload, {
      headers: {
        "Idempotency-Key": `pay-${reference_id}-${Date.now()}`
      }
    });

    return resp.data;
  }
};
