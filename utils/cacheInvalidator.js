const redisClient = require("./redis");

/**
 * hapus cache berdasarkan prefix
 *
 * contoh:
 * event:list
 * event:detail
 */
async function clearByPrefix(prefix) {

  const keys = await redisClient.keys(`${prefix}*`);

  if (keys.length) {

    await redisClient.del(keys);

  }

}


/**
 * clear cache event
 */
async function clearEventCache() {

  await clearByPrefix("api:GET:/events");

  await clearByPrefix("api:GET:/event");

  await clearByPrefix("api:GET:/home");

}


module.exports = {
  clearByPrefix,
  clearEventCache
};