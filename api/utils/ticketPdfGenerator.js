const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

module.exports = function generateTicketPDF({ ticket, event, ticketType }) {
  return new Promise((resolve, reject) => {
    const fileName = `${ticket.ticket_code}.pdf`;
    const filePath = path.join("uploads/tickets", fileName);

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text(event.name);
    doc.text("=================================");
    doc.fontSize(14).text(`Ticket: ${ticketType.name}`);
    doc.text(`Owner: ${ticket.owner_name}`);
    doc.text(`Email: ${ticket.owner_email}`);
    doc.text(`Identity: ${ticket.type_identity} - ${ticket.no_identity}`);
    doc.text(`Ticket Code: ${ticket.ticket_code}`);

    doc.end();

    doc.on("finish", () => resolve(filePath));
    doc.on("error", (err) => reject(err));
  });
};
