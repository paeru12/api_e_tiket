// models/systemfinancesettings.js

module.exports = (sequelize, DataTypes) => {
  const SystemFinanceSettings = sequelize.define(
    "SystemFinanceSettings",
    {
      tax_rate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 11.00, // Default tax rate 11%
      },
      service_tax_rate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 10.00, // Service tax rate if applicable
      },
    },
    {
      tableName: "system_finance_settings",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    }
  );

  return SystemFinanceSettings;
};