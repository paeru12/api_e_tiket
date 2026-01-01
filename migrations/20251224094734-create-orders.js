"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("(UUID())"),
        allowNull: false,
        primaryKey: true,
      },

      code_order: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },

      customer_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },

      customer_name: Sequelize.STRING,
      customer_email: Sequelize.STRING,
      customer_phone: Sequelize.STRING,
      type_identity: Sequelize.STRING,
      no_identity: Sequelize.STRING,

      total_amount: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },

      status: {
        type: Sequelize.ENUM("pending", "waiting_payment", "paid", "expired", "canceled"),
        defaultValue: "pending",
      },

      payment_method: Sequelize.STRING,

      expired_at: Sequelize.DATE,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("orders");
  },
};
