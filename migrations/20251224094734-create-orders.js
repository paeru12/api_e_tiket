// orders
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
      creator_id: { type: Sequelize.UUID, allowNull: false },
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

      // ====== FINANCE FIELDS ======
      ticket_subtotal: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },

      admin_fee_amount: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },

      tax_amount: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },

      // total dibayar buyer (ini yang dikirim ke payment gateway)
      buyer_pay_total: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },

      // pendapatan bersih organizer
      organizer_net_total: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
      },

      admin_fee_bearer: {
        type: Sequelize.ENUM("buyer", "organizer","mixed"),
        allowNull: false,
        defaultValue: "buyer",
      },

      tax_bearer: {
        type: Sequelize.ENUM("buyer", "organizer","mixed"),
        allowNull: false,
        defaultValue: "buyer",
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
    
    await queryInterface.addIndex("orders", ["status"]); 
    await queryInterface.addIndex("orders", ["expired_at"]); 
    await queryInterface.addIndex("orders", ["code_order"]); 
  },

  async down(queryInterface) {
    await queryInterface.dropTable("orders");
  },
};