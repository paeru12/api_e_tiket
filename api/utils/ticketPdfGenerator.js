const path = require("path");

const { getBrowser } =
  require("./browserPool");

const ejs = require("ejs");
const fs = require("fs");

const getQR =
  require("../../utils/qrCache");

const {
  imageToBase64Cached,
  watermarkBase64Cached
} = require("../../utils/imageCache");

const {
  generateSignature
} = require("./qrSignature");


let compiledTemplate;

function getTemplate() {

  if (!compiledTemplate) {

    const templatePath =
      path.join(
        process.cwd(),
        "api/templates/ticket.html"
      );

    compiledTemplate =
      ejs.compile(
        fs.readFileSync(
          templatePath,
          "utf8"
        )
      );

  }

  return compiledTemplate;

}


module.exports =
async function generateTicketPDF(
  ticket,
  event
) {

  const template =
    getTemplate();


  const logo =
    await imageToBase64Cached(

      path.join(
        process.cwd(),
        "public/uploads/logo/logo.png"
      ),

      { width: 280 }

    );


  const watermark =
    await watermarkBase64Cached(

      path.join(
        process.cwd(),
        "public/uploads/logo/watermark.png"
      )

    );


  const banner =
    await imageToBase64Cached(

      path.join(
        process.cwd(),
        "public",
        event.image.replace(/^\/+/, "")
      ),

      { width: 900 }

    );


  const signature =
    generateSignature(
      ticket.ticket_code,
      ticket.event_id
    );


  const payload =
    JSON.stringify({

      t: ticket.ticket_code,
      e: ticket.event_id,
      s: signature

    });


  const qr =
    await getQR(payload);


  const html =
    template({

      tickets: [

        {

          logo,
          watermark,
          banner,
          qr,

          ticketCode:
            ticket.ticket_code,

          eventName:
            event.name.toUpperCase(),

          ownerName:
            ticket.owner_name.toUpperCase(),

          email:
            ticket.owner_email,

          category:
            ticket.ticket_type.name.toUpperCase(),

          identity:
            `${ticket.type_identity} - ${ticket.no_identity}`,

          promoter:
            event.name

        }

      ]

    });


  let page;

  try {

    const browser =
      await getBrowser();

    page =
      await browser.newPage();

    await page.setContent(
      html,
      {
        waitUntil: "networkidle0"
      }
    );

    return await page.pdf({

      format: "A4",

      printBackground: true,

      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0"
      }

    });

  }

  finally {

    if (page) {

      await page.close()
        .catch(() => {});

    }

  }

};