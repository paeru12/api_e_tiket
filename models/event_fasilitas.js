'use strict';

module.exports = (sequelize, DataTypes) => {
  const EventFasilitas = sequelize.define('EventFasilitas', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    event_id: {
      type: DataTypes.UUID,
    },
    fasilitas_id: {
      type: DataTypes.UUID,
    }
  }, {
    tableName: 'event_fasilitas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  EventFasilitas.associate = (models) => {
    EventFasilitas.belongsTo(models.Event, {
      foreignKey: 'event_id',
      as: 'event_member'
    });
    EventFasilitas.belongsTo(models.Fasilitas, {
      foreignKey: 'fasilitas_id',
      as: 'fasilitas_member'
    });
  };

  return EventFasilitas;
};
