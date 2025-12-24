"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tickets", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("(UUID())"),
        primaryKey: true,
      },

      ticket_code: {
        type: Sequelize.STRING,
        unique: true,
      },

      order_id: Sequelize.UUID,
      event_id: Sequelize.UUID,
      ticket_type_id: Sequelize.UUID,

      owner_name: Sequelize.STRING,
      owner_email: Sequelize.STRING,
      owner_phone: Sequelize.STRING,
      type_identity: Sequelize.STRING,
      no_identity: Sequelize.STRING,

      qr_payload: Sequelize.TEXT,

      status: {
        type: Sequelize.ENUM("pending", "paid", "used", "expired"),
        defaultValue: "pending",
      },

      issued_at: Sequelize.DATE,
      used_at: Sequelize.DATE,
      used_by: Sequelize.UUID,

      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("tickets");
  },
};
