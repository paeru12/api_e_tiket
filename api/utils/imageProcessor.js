const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const DEFAULTS = {
  maxSize: 300 * 1024,
  maxWidth: 800,
  startQuality: 80,
  minQuality: 30,
  qualityStep: 5
};

module.exports = async function processImage(
  buffer,
  folder,
  options = {}
) {
  const config = { ...DEFAULTS, ...options };

  if (!buffer) throw new Error("Image buffer is required");

  const uploadRoot = path.join(__dirname, "../../public/uploads");
  const targetDir = path.join(uploadRoot, folder);
  fs.mkdirSync(targetDir, { recursive: true });

  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
  const outputPath = path.join(targetDir, filename);

  let quality = config.startQuality;
  let outputBuffer;

  while (quality >= config.minQuality) {
    outputBuffer = await sharp(buffer)
      .resize({
        width: config.maxWidth,
        withoutEnlargement: true
      })
      .webp({ quality })
      .toBuffer();

    if (outputBuffer.length <= config.maxSize) break;
    quality -= config.qualityStep;
  }

  if (!outputBuffer || outputBuffer.length > config.maxSize) {
    throw new Error("Image too large after compression");
  }

  fs.writeFileSync(outputPath, outputBuffer);
  return `/uploads/${folder}/${filename}`;
};
