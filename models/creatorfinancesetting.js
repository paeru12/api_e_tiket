module.exports = (sequelize, DataTypes) => {
  const CreatorFinanceSettings = sequelize.define(
    "CreatorFinanceSettings",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      creator_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      admin_fee_type: {
        type: DataTypes.ENUM("flat", "percent"),
        allowNull: false,
      },
      admin_fee_value: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
    },
    {
      tableName: "creator_finance_settings",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    }
  );

  CreatorFinanceSettings.associate = (models) => {
    CreatorFinanceSettings.belongsTo(models.Creator, {
      foreignKey: "creator_id",
      as: "creator",
    });
  };

  return CreatorFinanceSettings;
};