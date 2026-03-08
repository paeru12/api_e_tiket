"use strict";
module.exports = (sequelize, DataTypes) => {
  const CreatorBankAccounts = sequelize.define(
    "CreatorBankAccounts",
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

      bank_code: { type: DataTypes.STRING(20), allowNull: false },
      bank_name: { type: DataTypes.STRING(120), allowNull: false },
      account_number: { type: DataTypes.STRING(50), allowNull: false },
      account_holder_name: { type: DataTypes.STRING(120), allowNull: false },

      is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
      },
    {
      tableName: "creator_bank_accounts",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true,
      deletedAt: "deleted_at",
      underscored: true,
    }
    
  );

return CreatorBankAccounts;
};
