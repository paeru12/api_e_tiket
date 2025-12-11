const expressLoader = require('./loaders/express');
const sequelizeLoader = require('./loaders/sequelize');
const logger = require('./config/logger');

module.exports = async () => {
  try {
    // 1. Connect Database (Sequelize)
    await sequelizeLoader();
    logger.info('📦 Database connected successfully');

    // 2. Load Express App
    const app = expressLoader();
    logger.info('🚀 Express loaded successfully');

    return app;

  } catch (error) {
    logger.error('❌ App failed to start:', error);
    throw error;
  }
};
