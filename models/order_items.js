"use strict";

module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    "OrderItem",
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      order_id: DataTypes.UUID,
      ticket_type_id: DataTypes.UUID,
      quantity: DataTypes.BIGINT,
      unit_price: DataTypes.DECIMAL,
      total_price: DataTypes.DECIMAL,
    },
    {
      tableName: "order_items",
      underscored: true,
    }
  );

  return OrderItem;
};
