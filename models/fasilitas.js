"use strict";
module.exports = (sequelize, DataTypes) => {
  const Fasilitas = sequelize.define(
    "Fasilitas",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      author_id: DataTypes.UUID,
      name: DataTypes.STRING,
      icon: DataTypes.TEXT,
    },
    {
      tableName: "fasilitas",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    }
  );

  Fasilitas.associate = (models) => {
    Fasilitas.belongsToMany(models.Event, {
      through: models.EventFasilitas,
      foreignKey: 'fasilitas_id',
      otherKey: 'event_id',
      as: 'events'
    });
    Fasilitas.belongsTo(models.User, {
      foreignKey: "author_id",
      as: "author"
    });
  };

  return Fasilitas;
};
