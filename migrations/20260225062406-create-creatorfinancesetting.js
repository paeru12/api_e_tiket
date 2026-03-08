// migrations/[timestamp]-create-creator-finance-settings.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("creator_finance_settings", {
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
      admin_fee_type: {
        type: Sequelize.ENUM("flat", "percent"),
        allowNull: false,
      },
      admin_fee_value: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("creator_finance_settings");
  },
};