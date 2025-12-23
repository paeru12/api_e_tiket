// utils/sendEmail.js
const nodemailer = require("nodemailer");

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  EMAIL_FROM
} = process.env;

async function createTransporter() {
  // if credentials provided -> use them (SES SMTP or Gmail)
  if (SMTP_USER && SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST || "email-smtp.ap-southeast-1.amazonaws.com",
      port: parseInt(SMTP_PORT, 10) || 587,
      secure: parseInt(SMTP_PORT, 10) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 10000
    });

    // verify transporter quickly (will reject if credentials wrong)
    try {
      await transporter.verify();
      console.info("Mailer: SMTP transporter verified");
    } catch (err) {
      console.warn("Mailer: SMTP transporter verify failed:", err && err.message);
      // still return transporter so sendMail gives full error later
    }

    return { transporter, isTest: false };
  }

  // fallback: create Ethereal test account (dev only)
  console.warn("Mailer: SMTP credentials not set - creating Ethereal test account (dev)");
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
  return { transporter, isTest: true, testAccount };
}

module.exports = async function sendEmail(to, subject, html) {
  const { transporter, isTest, testAccount } = await createTransporter();

  const from = EMAIL_FROM || SMTP_USER || (isTest ? testAccount.user : "no-reply@example.com");

  try {
    const info = await transporter.sendMail({ from, to, subject, html });
    // if Ethereal, print preview URL to console
    if (isTest) {
      console.info("Ethereal message preview URL:", nodemailer.getTestMessageUrl(info));
      return { ok: true, info, previewUrl: nodemailer.getTestMessageUrl(info) };
    }
    return { ok: true, info };
  } catch (err) {
    // include original error so caller can log stack
    console.error("Mailer sendMail error:", err && err.message ? err.message : err);
    // rethrow full error (caller/service will catch and can decide fallback)
    throw err;
  }
};
