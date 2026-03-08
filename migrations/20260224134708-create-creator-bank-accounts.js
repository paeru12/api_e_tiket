'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("creator_bank_accounts", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("(UUID())"),
        allowNull: false,
        primaryKey: true
      },
      creator_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      bank_code: { type: Sequelize.STRING(20), allowNull: false },
      bank_name: { type: Sequelize.STRING(120), allowNull: false },
      account_number: { type: Sequelize.STRING(50), allowNull: false },
      account_holder_name: { type: Sequelize.STRING(120), allowNull: false },

      is_verified: { type: Sequelize.BOOLEAN, defaultValue: false },

      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    });

    await queryInterface.addConstraint("creator_bank_accounts", {
      fields: ["creator_id"],
      type: "unique",
      name: "unique_bank_per_creator"
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("creator_bank_accounts");
  }
};