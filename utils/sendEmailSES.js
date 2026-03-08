const nodemailer = require("nodemailer");

let transporter;

function getTransporter() {

  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  return transporter;

}

module.exports = async function sendEmail(to, subject, html, pdfBuffer, names) {

  const transporter = getTransporter();

  await transporter.sendMail({

    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,

    attachments: pdfBuffer
      ? [
          {
            filename: `${names}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf"
          }
        ]
      : []

  });

};