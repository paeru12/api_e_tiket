// utils/xenditPayoutV2.js
const axios = require("axios");

const client = axios.create({
    baseURL: "https://api.xendit.co",
    auth: {
        username: process.env.XENDIT_SECRET_KEY,
        password: ""
    },
    headers: {
        "Content-Type": "application/json"
    }
});

module.exports = {
    async createDisbursement({
        externalID,
        amount,
        bankCode,
        accountHolderName,
        accountNumber,
        description
    }) {
        const payload = {
            external_id: externalID,
            amount: Number(amount),
            bank_code: bankCode,
            account_holder_name: accountHolderName,
            account_number: accountNumber,
            description
        };

        const resp = await client.post(
            "/disbursements",
            payload,
            {
                headers: {
                    "Idempotency-Key": `payout-${externalID}-${Date.now()}`
                }
            }
        );

        return resp.data;
    }
};
