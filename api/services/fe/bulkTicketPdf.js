const path = require("path");
const ejs = require("ejs");
const fs = require("fs");

const { getBrowser } =
  require("../../utils/browserPool");

const getQR =
  require("../../../utils/qrCache");

const {
  imageToBase64Cached,
  watermarkBase64Cached
} = require("../../../utils/imageCache");

const {
  generateSignature
} = require("../../utils/qrSignature");


let compiledTemplate;

function getTemplate() {

  if (!compiledTemplate) {

    const templatePath =
      path.join(
        process.cwd(),
        "api/templates/ticket.html"
      );

    console.log(
      "compile ticket template..."
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
  async function generateBulkTicketPDF(
    order,
    event,
    tickets
  ) {

    console.log(
      `Generate PDF order ${order.id}, total ticket ${tickets.length}`
    );


    const template =
      getTemplate();


    const logo =
      await imageToBase64Cached(

        path.join(
          process.cwd(),
          "public/uploads/logo/logo.png"
        ),

        {
          width: 280,
          quality: 60
        }

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

        {
          width: 900,
          quality: 55
        }

      );



    const ticketViews =
      await Promise.all(

        tickets.map(async (ticket) => {

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


          return {

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

          };

        })

      );


    const html =
      template({

        tickets: ticketViews

      });



    let page;

    try {

      const browser =
        await getBrowser();


      page =
        await browser.newPage();


      await page.setViewport({

        width: 1240,
        height: 1754

      });


      await page.setContent(

        html,

        {

          waitUntil: "networkidle0",

          timeout: 60000

        }

      );


      const pdf =
        await page.pdf({

          format: "A4",

          printBackground: true,

          preferCSSPageSize: true,

          margin: {

            top: "0",
            right: "0",
            bottom: "0",
            left: "0"

          }

        });


      console.log(
        `PDF done order ${order.id}`
      );


      return pdf;

    }

    finally {

      if (page) {

        await page.close()
          .catch(() => { });

      }

    }

  };