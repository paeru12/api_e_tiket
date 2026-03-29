const nodemailer = require("nodemailer");

let transporter;

function getTransporter() {

  if (transporter) return transporter;

  transporter = nodemailer.createTransport({

    host: process.env.SMTP_HOST,

    port: Number(process.env.SMTP_PORT),

    secure: false,

    auth: {

      user: process.env.SMTP_USER,

      pass: process.env.SMTP_PASS

    },

    pool: true,

    maxConnections: 2,

    maxMessages: 50,

    rateLimit: 5

  });

  return transporter;

}



module.exports =
  async function sendEmail(

    to,
    subject,
    html,
    attachments = []

  ) {

    const transporter =
      getTransporter();

    console.log(

      "total attachment:",
      attachments.length

    );

    return transporter.sendMail({

      from: process.env.EMAIL_FROM,

      to,

      subject,

      html,

      text: "Tiket event terlampir",

      attachments

    });

  };