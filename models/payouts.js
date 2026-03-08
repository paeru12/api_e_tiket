"use strict";
module.exports = (sequelize, DataTypes) => {
  const Payouts = sequelize.define(
    "Payouts",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },

      creator_id: {
        type: DataTypes.UUID,
        allowNull: false
      },

      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
      },

      // Disbursement V2 fields
      xendit_disbursement_id: { type: DataTypes.STRING },
      status: {
        type: DataTypes.ENUM(
          "REQUESTED",    // promotor minta
          "APPROVED",     // admin setujui (opsional)
          "PENDING",      // dikirim ke Xendit
          "COMPLETED",    // sukses
          "FAILED",       // gagal
          "REJECTED"      // ditolak admin
        ),
        defaultValue: "REQUESTED"
      },

      approved_by: { type: DataTypes.UUID },
      approved_at: { type: DataTypes.DATE },

      failure_reason: { type: DataTypes.STRING }
    },
    {
      tableName: "payouts",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true
    }
  );

  Payouts.associate = (models) => {
    Payouts.belongsTo(models.Creator, {
      foreignKey: "creator_id",
      as: "creator"
    });
    Payouts.belongsTo(models.CreatorBankAccounts, {
      foreignKey: "creator_id",
      targetKey: "creator_id",
      as: "bank_info"
    });
  };

  return Payouts;
};
