// utils/xenditDisbursement.js
const axios = require("axios");

const client = axios.create({
  baseURL: "https://api.xendit.co/disbursements",
  auth: {
    username: process.env.XENDIT_SECRET_KEY,
    password: ""
  },
  headers: {
    "Content-Type": "application/json"
  }
});

module.exports = {
  async createDisbursement({ externalId, amount, bank }) {
    const payload = {
      external_id: externalId,
      amount: Number(amount),
      bank_code: bank.bank_code, // Example: "BCA"
      account_holder_name: bank.holder_name,
      account_number: bank.account_number,
      description: "Payout to event organizer"
    };

    const resp = await client.post("/", payload);
    return resp.data; // Xendit returns disbursement record
  }
};
