module.exports = (sequelize, DataTypes) => {

  const EventStaffAssignment = sequelize.define(
    "EventStaffAssignment",
    {

      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },

      creator_id: DataTypes.UUID,

      event_id: DataTypes.UUID,

      user_id: DataTypes.UUID,

      assigned_gate: DataTypes.STRING,

      role: {
        type: DataTypes.ENUM("scanner", "gate_admin")
      },

      status: {
        type: DataTypes.ENUM("pending", "accepted", "rejected")
      },

      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },

      accepted_at: DataTypes.DATE,

      created_by: DataTypes.UUID

    },
    {
      tableName: "event_staff_assignments",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true
    }
  );

  EventStaffAssignment.associate = (models) => {

    EventStaffAssignment.belongsTo(models.Event, {
      foreignKey: "event_id",
      as: "event"
    });

    EventStaffAssignment.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user"
    });

  };

  return EventStaffAssignment;

};