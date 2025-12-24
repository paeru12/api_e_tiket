"use strict";

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      code_order: DataTypes.STRING,
      customer_user_id: DataTypes.UUID,
      customer_name: DataTypes.STRING,
      customer_email: DataTypes.STRING,
      customer_phone: DataTypes.STRING,
      type_identity: DataTypes.STRING,
      no_identity: DataTypes.STRING,

      total_amount: DataTypes.DECIMAL,
      status: DataTypes.STRING,
      payment_method: DataTypes.STRING,
      expired_at: DataTypes.DATE,
    },
    {
      tableName: "orders",
      underscored: true,
      paranoid: false,
    }
  );

  Order.associate = (models) => {
    Order.hasMany(models.OrderItem, { foreignKey: "order_id" });
    Order.hasMany(models.Payment, { foreignKey: "order_id" });
    Order.hasMany(models.Ticket, { foreignKey: "order_id" });
  };

  return Order;
};
