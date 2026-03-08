const fs = require("fs");
const path = require("path");
const ejs = require("ejs");

let compiledTemplate;

function getTemplate() {

  if (!compiledTemplate) {

    const templatePath = path.join(
      process.cwd(),
      "api/templates/ticket.html"
    );

    const template = fs.readFileSync(templatePath, "utf8");

    compiledTemplate = ejs.compile(template);

  }

  return compiledTemplate;

}

module.exports = getTemplate;