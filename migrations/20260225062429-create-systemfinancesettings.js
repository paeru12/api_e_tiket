// migrations/[timestamp]-create-system-finance-settings.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("system_finance_settings", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      tax_rate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 11.00, // Default tax rate 11%
      },
      service_tax_rate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 10.00, // Example of an additional service tax rate
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
    await queryInterface.dropTable("system_finance_settings");
  },
};