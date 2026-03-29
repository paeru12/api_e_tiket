"use strict";

module.exports = (sequelize, DataTypes) => {
  const TicketBundles = sequelize.define(
    "TicketBundles",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      event_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING(150),
        allowNull: false
      },

      description: DataTypes.TEXT,

      /* =========================
         PRICING
      ========================= */

      price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
      },

      discount_type: {
        type: DataTypes.ENUM("percent", "flat"),
        allowNull: true
      },

      discount_value: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true
      },

      /* =========================
         STOCK
      ========================= */

      total_stock: {
        type: DataTypes.BIGINT,
        allowNull: true
      },

      sold: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },

      reserved_stock: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },

      max_per_order: {
        type: DataTypes.INTEGER,
        defaultValue: 10
      },

      /* =========================
         SALE
      ========================= */

      sale_start: {
        type: DataTypes.DATE,
        allowNull: false
      },

      sale_end: {
        type: DataTypes.DATE,
        allowNull: false
      },

      /* =========================
         STATUS
      ========================= */

      status: {
        type: DataTypes.ENUM("scheduled", "on_sale", "ended"),
        defaultValue: "scheduled"
      },

      is_hidden: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
    },
    {
      tableName: "ticket_bundles",
      underscored: true,
      timestamps: true,
    }
  );

  TicketBundles.associate = (models) => {

    TicketBundles.belongsTo(models.Event, {
      foreignKey: "event_id",
      as: "event"
    });

    TicketBundles.hasMany(models.TicketBundleItem, {
      foreignKey: "bundle_id",
      as: "items"
    });

  };

  return TicketBundles;
};
