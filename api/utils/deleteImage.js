const fs = require("fs");
const path = require("path");

module.exports = function deleteImage(imageUrl) {
  if (!imageUrl) return;

  // contoh imageUrl: /uploads/kategoris/xxx.webp
  const filePath = path.join(
    __dirname,
    "../../public",
    imageUrl
  );

  // safety check
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
