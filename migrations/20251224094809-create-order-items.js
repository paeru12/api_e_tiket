"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("order_items", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("(UUID())"),
        allowNull: false,
        primaryKey: true,
      },

      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      ticket_type_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      quantity: Sequelize.BIGINT,
      unit_price: Sequelize.DECIMAL(15, 2),
      total_price: Sequelize.DECIMAL(15, 2),

      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("order_items");
  },
};
