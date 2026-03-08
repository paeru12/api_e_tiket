"use strict";
module.exports = (sequelize, DataTypes) => {
  const GuestStars = sequelize.define(
    "GuestStars",
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
      tableName: "guest_stars",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    }
  );

  return GuestStars;
};
