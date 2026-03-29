const QRCode = require("qrcode");

const cache = new Map();

async function getQR(payload) {

  if (cache.has(payload)) {
    return cache.get(payload);
  }

  const qr =
    await QRCode.toDataURL(
      payload,
      {
        errorCorrectionLevel: "M",
        width: 280,
        margin: 1
      }
    );

  cache.set(payload, qr);

  return qr;
}

module.exports = getQR;