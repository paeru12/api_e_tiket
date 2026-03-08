const QRCode = require("qrcode");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const { getBrowser } = require("./browserPool");
const getTemplate = require("./templateCache");
const { generateSignature } = require("./qrSignature");

async function imageToBase64(filePath) {

  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".webp") {
    const buffer = await sharp(filePath).png().toBuffer();
    return `data:image/png;base64,${buffer.toString("base64")}`;
  }

  const buffer = fs.readFileSync(filePath);

  return `data:image/${ext.replace(".", "")};base64,${buffer.toString("base64")}`;
}

module.exports = async function generateTicketPDF(ticketData) {

  const { ticket, event, ticketType, promoter } = ticketData;

  const signature = generateSignature(ticket.ticket_code, ticket.event_id);

  const payload = JSON.stringify({
    t: ticket.ticket_code,
    e: ticket.event_id,
    s: signature
  });

  const qr = await QRCode.toDataURL(payload, {
    errorCorrectionLevel: "H"
  });

  const template = getTemplate();

  const logo = await imageToBase64(
    path.join(process.cwd(), "public/uploads/logo/belisenang_png.png")
  );

  const banner = await imageToBase64(
    path.join(process.cwd(), "public", event.image.replace(/^\/+/, ""))
  );

  const html = template({
    logo,
    banner,
    qr,
    ticketCode: ticket.ticket_code,
    eventName: event.name.toUpperCase(),
    ownerName: ticket.owner_name.toUpperCase(),
    email: ticket.owner_email,
    category: ticketType.name.toUpperCase(),
    identity: `${ticket.type_identity} - ${ticket.no_identity}`,
    promoter
  });

  const browser = await getBrowser();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "domcontentloaded" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true
  });

  await page.close();

  return pdf;
};