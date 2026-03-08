const NodeCache = require("node-cache");

const cache = new NodeCache({
  stdTTL: 120,
  checkperiod: 60,
  useClones: false
});

module.exports = cache;