"use strict";

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      code_order: DataTypes.STRING,
      customer_id: DataTypes.UUID,
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
    }
  );

  Order.associate = (models) => {
    Order.belongsTo(models.CustomerUser, {
      foreignKey: "customer_id",
      as: "customer",
    });

    Order.hasMany(models.OrderItem, {
      foreignKey: "order_id",
      as: "items",
    });

    Order.hasMany(models.Payment, {
      foreignKey: "order_id",
      as: "payments",
    });

    Order.hasMany(models.Ticket, {
      foreignKey: "order_id",
      as: "tickets",
    });

  };


  return Order;
};
