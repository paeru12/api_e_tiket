const multer = require("multer");

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("File harus berupa gambar"), false);
  }
  cb(null, true);
}

module.exports = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // max input 5MB
  }
});