"use strict";

module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define(
    "Ticket",
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      ticket_code: DataTypes.STRING,
      order_id: DataTypes.UUID,
      event_id: DataTypes.UUID,
      ticket_type_id: DataTypes.UUID,

      owner_name: DataTypes.STRING,
      owner_email: DataTypes.STRING,
      owner_phone: DataTypes.STRING,
      type_identity: DataTypes.STRING,
      no_identity: DataTypes.STRING,

      qr_payload: DataTypes.TEXT,
      status: DataTypes.STRING,
      issued_at: DataTypes.DATE,
      used_at: DataTypes.DATE,
      used_by: DataTypes.UUID,
    },
    {
      tableName: "tickets",
      underscored: true,
    }
  );

  return Ticket;
};
