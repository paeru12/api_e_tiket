"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable("ticket_bundles", {

      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("(UUID())"),
        primaryKey: true
      },

      event_id: {
        type: Sequelize.UUID,
        allowNull: false
      },

      /* =========================
         BASIC INFO
      ========================= */

      name: {
        type: Sequelize.STRING(150),
        allowNull: false
      },

      description: Sequelize.TEXT,

      /* =========================
         PRICING
      ========================= */

      price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },

      discount_type: {
        type: Sequelize.ENUM("percent", "flat"),
        allowNull: true
      },

      discount_value: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },

      /* =========================
         STOCK
      ========================= */

      total_stock: {
        type: Sequelize.BIGINT,
        allowNull: true
      },

      sold: {
        type: Sequelize.BIGINT,
        defaultValue: 0
      },

      reserved_stock: {
        type: Sequelize.BIGINT,
        defaultValue: 0
      },

      max_per_order: {
        type: Sequelize.INTEGER,
        defaultValue: 10
      },

      /* =========================
         SALE
      ========================= */

      sale_start: {
        type: Sequelize.DATE,
        allowNull: false
      },

      sale_end: {
        type: Sequelize.DATE,
        allowNull: false
      },

      /* =========================
         STATUS
      ========================= */

      status: {
        type: Sequelize.ENUM("scheduled", "on_sale", "ended"),
        defaultValue: "scheduled"
      },

      is_hidden: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },

      deleted_at: Sequelize.DATE

    });

    await queryInterface.addIndex("ticket_bundles", ["event_id"]);
    await queryInterface.addIndex("ticket_bundles", ["status"]);
    await queryInterface.addIndex("ticket_bundles", ["sale_start"]);
    await queryInterface.addIndex("ticket_bundles", ["sale_end"]);

  },

  async down(queryInterface) {
    await queryInterface.dropTable("ticket_bundles");
  }
};