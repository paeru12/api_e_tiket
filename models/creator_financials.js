"use strict";
module.exports = (sequelize, DataTypes) => {
  const CreatorFinancials = sequelize.define(
    "CreatorFinancials",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      creator_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      total_income: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
      total_payout: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
      current_balance: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
      pending_income: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
    },
    {
      tableName: "creator_financials",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    }

  );

  return CreatorFinancials;
};
