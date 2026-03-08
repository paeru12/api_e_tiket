'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payouts", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("(UUID())"),
        allowNull: false,
        primaryKey: true
      },

      creator_id: {
        type: Sequelize.UUID,
        allowNull: false
      },

      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },

      xendit_disbursement_id: Sequelize.STRING,
      status: {
        type: Sequelize.ENUM(
          "REQUESTED",
          "APPROVED",
          "PENDING",
          "COMPLETED",
          "FAILED",
          "REJECTED"
        ),
        defaultValue: "REQUESTED"
      },

      approved_by: Sequelize.UUID,
      approved_at: Sequelize.DATE,
      failure_reason: Sequelize.STRING,

      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("payouts");
  }
};
