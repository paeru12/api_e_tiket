// /loaders/sequelize.js
const db = require("../models");
const logger = require("../config/logger");

module.exports = async () => {
  try {
    await db.sequelize.authenticate();
    logger.info("📦 Database connected");
  } catch (err) {
    logger.error("❌ Database connection failed", err);
    process.exit(1); // matikan server jika DB error
  }

  // Optional: sync model (bisa dinyalakan saat development)
  // await db.sequelize.sync({ alter: false });
};
