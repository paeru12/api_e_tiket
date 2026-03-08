"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable("ticket_scan_logs", {

      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("(UUID())"),
        primaryKey: true,
        allowNull: false
      },

      creator_id: {
        type: Sequelize.UUID,
        allowNull: false
      },

      ticket_id: {
        type: Sequelize.UUID,
        allowNull: false
      },

      event_id: {
        type: Sequelize.UUID,
        allowNull: false
      },

      scanned_by: {
        type: Sequelize.UUID,
        allowNull: true
      },

      gate: {
        type: Sequelize.STRING(100),
        allowNull: true
      },

      device_id: {
        type: Sequelize.STRING(120),
        allowNull: true
      },

      scan_source: {
        type: Sequelize.STRING(50),
        allowNull: true
      },

      raw_qr_payload: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      result: {
        type: Sequelize.ENUM(
          "success",
          "duplicate",
          "invalid",
          "wrong_event"
        ),
        allowNull: false
      },

      message: {
        type: Sequelize.STRING(255),
        allowNull: true
      },

      scanned_at: {
        type: Sequelize.DATE,
        allowNull: false
      }

    });

    // indexes untuk performa scan
    await queryInterface.addIndex("ticket_scan_logs", ["event_id"]);
    await queryInterface.addIndex("ticket_scan_logs", ["ticket_id"]);
    await queryInterface.addIndex("ticket_scan_logs", ["scanned_at"]);

  },

  async down(queryInterface) {
    await queryInterface.dropTable("ticket_scan_logs");
  }
};