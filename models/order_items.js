// models/OrderItem.js
"use strict";

module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    "OrderItem",
    {
      id: { type: DataTypes.UUID, primaryKey: true },

      order_id: DataTypes.UUID,
      item_type: {
        type: DataTypes.ENUM("ticket", "bundle"),
        allowNull: false
      },

      ticket_type_id: {
        type: DataTypes.UUID,
        allowNull: true
      },

      bundle_id: {
        type: DataTypes.UUID,
        allowNull: true
      },

      quantity: DataTypes.BIGINT,

      // FINANCE PER ITEM
      ticket_price: DataTypes.DECIMAL(15, 2),
      admin_fee_amount: DataTypes.DECIMAL(15, 2),
      tax_amount: DataTypes.DECIMAL(15, 2),

      buyer_pay_amount: DataTypes.DECIMAL(15, 2),
      organizer_net: DataTypes.DECIMAL(15, 2),

      attendees: DataTypes.JSON,
    },
    {
      tableName: "order_items",
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    }
  );

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.TicketType, {
      foreignKey: "ticket_type_id",
      as: "ticket_type",
    });
    OrderItem.belongsTo(models.TicketBundles, {
      foreignKey: "bundle_id",
      as: "ticket_bundles",
    });

    OrderItem.hasMany(models.Ticket, {
      foreignKey: "order_item_id",
      as: "tickets",
    });

    OrderItem.belongsTo(models.Order, {
      foreignKey: "order_id",
      as: "order",
    });
  };

  return OrderItem;
};