const QRCode = require("qrcode");

module.exports = async function generateQR(text) {
  try {
    return await QRCode.toDataURL(text);
  } catch (err) {
    console.error("QR Generate Failed:", err);
    throw err;
  }
};
