// utils/redis.js
const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379"
});

client.connect().catch(console.error);

module.exports = client;
