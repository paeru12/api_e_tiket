"use strict";
module.exports = (sequelize, DataTypes) => {
  const Sponsors = sequelize.define(
    "Sponsors",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      event_id: DataTypes.UUID,
      name: DataTypes.STRING,
      image: DataTypes.TEXT,
    },
    {
      tableName: "sponsors",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    }
  );

  return Sponsors;
};
