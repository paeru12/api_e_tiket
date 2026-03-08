"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable("ticket_daily_usage", {

      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("(UUID())"),
        primaryKey: true
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

      usage_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },

      used_at: {
        type: Sequelize.DATE,
        allowNull: true
      },

      scanned_by: {
        type: Sequelize.UUID,
        allowNull: true
      },

      gate: {
        type: Sequelize.STRING(100),
        allowNull: true
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      }

    });

    await queryInterface.addIndex("ticket_daily_usage", ["ticket_id"]);
    await queryInterface.addIndex("ticket_daily_usage", ["event_id"]);
    await queryInterface.addIndex("ticket_daily_usage", ["usage_date"]);

    await queryInterface.addConstraint("ticket_daily_usage", {
      fields: ["ticket_id", "usage_date"],
      type: "unique",
      name: "unique_ticket_daily_usage"
    });

  },

  async down(queryInterface) {
    await queryInterface.dropTable("ticket_daily_usage");
  }
};