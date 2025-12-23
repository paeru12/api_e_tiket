// migrations/xxxx-create-admin-refresh-tokens.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("admin_refresh_tokens", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("(UUID())"),
        primaryKey: true
      },
      user_id: Sequelize.UUID,
      token: Sequelize.TEXT,
      expires_at: Sequelize.DATE,
      created_at: Sequelize.DATE
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("admin_refresh_tokens");
  }
};
