const processImage = require("../../utils/imageProcessor");

module.exports = {
  async upload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const processedPath = await processImage(req.file.buffer, "x");

      const url = `${process.env.MEDIA_URL_FRONTEND}${processedPath}`;

      return res.json({ url });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Upload failed" });
    }
  },
};