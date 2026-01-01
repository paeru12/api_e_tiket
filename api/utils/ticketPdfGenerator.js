const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

module.exports = async function generateTicketPDF({ ticket, event, ticketType }) {
  return new Promise(async (resolve, reject) => {
    try {
      const fileName = `${ticket.ticket_code}.pdf`;
      const dirPath = path.join("uploads", "tickets");
      const filePath = path.join(dirPath, fileName);

      // pastikan folder ada
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // ===== HEADER =====
      doc.fontSize(20).text(event.name, { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text("=================================", { align: "center" });
      doc.moveDown();

      // ===== INFO TIKET =====
      doc.fontSize(14).text(`Ticket: ${ticketType.name}`);
      doc.text(`Owner: ${ticket.owner_name}`);
      doc.text(`Email: ${ticket.owner_email}`);
      doc.text(`Identity: ${ticket.type_identity} - ${ticket.no_identity}`);
      doc.moveDown(2);

      // ===== QR PAYLOAD =====
      const qrPayload = JSON.stringify({
        ticket_code: ticket.ticket_code,
        order_id: ticket.order_id,
        event_id: ticket.event_id,
      });

      // generate QR buffer
      const qrBuffer = await QRCode.toBuffer(qrPayload, {
        type: "png",
        errorCorrectionLevel: "H",
        width: 300,
      });

      // ===== QR CODE DI PDF =====
      doc.fontSize(14).text("Scan QR Code di pintu masuk:", {
        align: "center",
      });
      doc.moveDown();

      doc.image(qrBuffer, {
        fit: [200, 200],
        align: "center",
      });

      doc.moveDown();
      doc.fontSize(10).text(ticket.ticket_code, { align: "center" });

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
};
