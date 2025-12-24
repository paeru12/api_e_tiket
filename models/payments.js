"use strict";

module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "Payment",
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      order_id: DataTypes.UUID,
      provider: DataTypes.STRING,
      provider_transactions: DataTypes.STRING,
      amount: DataTypes.DECIMAL,
      status: DataTypes.STRING,
      payment_method: DataTypes.STRING,
      qris_payload: DataTypes.TEXT,
      qris_image_url: DataTypes.TEXT,
      qris_expired_at: DataTypes.DATE,
      raw_callback_log: DataTypes.TEXT,
      paid_at: DataTypes.DATE,
    },
    {
      tableName: "payments",
      underscored: true,
    }
  );

  return Payment;
};
