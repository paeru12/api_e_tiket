'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('admin_audit_logs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('(UUID())'),
        allowNull: false,
        primaryKey: true
      },
      user_id: Sequelize.UUID,
      action: Sequelize.STRING(50),
      ip_address: Sequelize.STRING(50),
      user_agent: Sequelize.TEXT,
      created_at: Sequelize.DATE
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('admin_audit_logs');
  }
};