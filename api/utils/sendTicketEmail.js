const nodemailer = require("nodemailer");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  host: "email-smtp.ap-southeast-1.amazonaws.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SES_SMTP_USER,
    pass: process.env.SES_SMTP_PASS
  }
});

module.exports = async function sendTicketEmail(to, name, pdfPath) {
  return await transporter.sendMail({
    from: process.env.SES_EMAIL_FROM,
    to,
    subject,
    html,
    attachments: pdfPath ? [{
      filename: pdfPath.split("/").pop(),
      path: pdfPath
    }] : []
  });
};
