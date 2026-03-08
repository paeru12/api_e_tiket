const crypto = require("crypto");

const SECRET = process.env.QR_SECRET;

function generateSignature(ticket_code, event_id) {

  return crypto
    .createHmac("sha256", SECRET)
    .update(ticket_code + "|" + event_id)
    .digest("hex");

}

function verifySignature(ticket_code, event_id, signature) {

  const expected = generateSignature(ticket_code, event_id);

  return expected === signature;

}

module.exports = {
  generateSignature,
  verifySignature
};
