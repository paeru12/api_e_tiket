const puppeteer = require("puppeteer");

let browser;
let launching;


/*
pastikan hanya 1 proses launch
*/
async function getBrowser() {

  if (browser && browser.isConnected()) {
    return browser;
  }

  /*
  cegah race condition
  */
  if (!launching) { 

    launching =
      puppeteer.launch({

        headless: "new",

        args: [

          "--no-sandbox",
          "--disable-setuid-sandbox",

          "--disable-dev-shm-usage",

          "--disable-gpu",

          "--disable-web-security",

          "--font-render-hinting=none",

          "--no-first-run",

          "--no-zygote"

        ]

      })
        .then(b => {

          browser = b;

          browser.on(

            "disconnected",

            () => {

              console.warn(
                "Browser disconnected"
              );

              browser = null;

            }

          );

          return browser;

        });

  }

  browser = await launching;

  launching = null;

  return browser;

}


async function closeBrowser() {

  if (browser) {

    await browser.close();

    browser = null;

  }

}


module.exports = {

  getBrowser,
  closeBrowser

};