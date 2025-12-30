const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

module.exports = async function generateTicketPDF({
  ticketCode,
  eventName,
  ownerName,
  qrcodeBase64
}) {
  return new Promise((resolve, reject) => {
    const dir = path.join("uploads", "tickets");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filename = `ticket_${ticketCode}.pdf`;
    const filepath = path.join(dir, filename);

    const doc = new PDFDocument({ size: "A5", layout: "portrait" });
    const stream = fs.createWriteStream(filepath);

    doc.pipe(stream);

    // Header
    doc.fontSize(20).text("E-Ticket", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Event: ${eventName}`);
    doc.text(`Name: ${ownerName}`);
    doc.text(`Ticket Code: ${ticketCode}`);
    doc.moveDown(2);

    // QR
    doc.image(Buffer.from(qrcodeBase64.split(",")[1], "base64"), {
      align: "center",
      width: 200,
      height: 200
    });

    doc.end();

    stream.on("finish", () => resolve(filepath.replace(/\\/g, "/")));
    stream.on("error", reject);
  });
};
