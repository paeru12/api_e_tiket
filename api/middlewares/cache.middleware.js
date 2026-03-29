const redisClient = require("../../utils/redis");

/**
 * generate cache key otomatis dari:
 * method + url + query
 */
function buildCacheKey(req, prefix = "api") {

  const base = `${prefix}:${req.method}:${req.baseUrl}${req.path}`;

  const query = Object.keys(req.query).length
    ? ":" + JSON.stringify(req.query)
    : "";

  return base + query;
}


/**
 * middleware cache universal
 */
function cacheMiddleware(options = {}) {

  const {
    ttl = 300,
    prefix = "api",
    customKey = null
  } = options;

  return async (req, res, next) => {

    try {

      const cacheKey = customKey
        ? customKey(req)
        : buildCacheKey(req, prefix);

      const cached = await redisClient.get(cacheKey);

      if (cached) {

        return res.json(JSON.parse(cached));

      }

      const originalJson = res.json.bind(res);

      res.json = async (body) => {

        await redisClient.setEx(
          cacheKey,
          ttl,
          JSON.stringify(body)
        );

        return originalJson(body);

      };

      next();

    } catch (err) {

      console.error("cache middleware error:", err);

      next();

    }

  };

}

module.exports = {
  cacheMiddleware,
  buildCacheKey
};