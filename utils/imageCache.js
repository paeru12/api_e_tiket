const sharp = require("sharp");

const cache = new Map();

function buildKey(filePath, options) {

  return JSON.stringify({
    filePath,
    ...options
  });

}


async function imageToBase64Cached(

  filePath,

  options = {}

) {

  const {

    width = 1000, // lebih kecil

    quality = 55, // compress lebih kuat

    format = "jpeg"

  } = options;


  const key =
    buildKey(filePath, {
      width,
      quality,
      format
    });


  if (cache.has(key)) {
    return cache.get(key);
  }


  const buffer =
    await sharp(filePath)

      .resize({
        width,
        withoutEnlargement: true
      })

      .jpeg({
        quality,
        mozjpeg: true
      })

      .toBuffer();


  const base64 =
    `data:image/jpeg;base64,${buffer.toString("base64")}`;


  cache.set(key, base64);

  return base64;

}



/*
watermark sangat kecil saja
*/
async function watermarkBase64Cached(filePath) {

  const key =
    `watermark:${filePath}`;

  if (cache.has(key)) {
    return cache.get(key);
  }


  const buffer =
    await sharp(filePath)

      .resize({ width: 220 })

      .png({
        quality: 40,
        compressionLevel: 9
      })

      .toBuffer();


  const base64 =
    `data:image/png;base64,${buffer.toString("base64")}`;


  cache.set(key, base64);

  return base64;

}


module.exports = {

  imageToBase64Cached,
  watermarkBase64Cached

};