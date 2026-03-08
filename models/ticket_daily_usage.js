module.exports = (sequelize, DataTypes) => {

  const TicketDailyUsage = sequelize.define(
    "TicketDailyUsage",
    {

      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      creator_id: DataTypes.UUID,

      ticket_id: DataTypes.UUID,

      event_id: DataTypes.UUID,
      used_at: DataTypes.DATE,
      scanned_by: DataTypes.UUID,
      gate: DataTypes.STRING(100),
    },
    {
      tableName: "ticket_daily_usage",
      timestamps: false
    }
  );

  TicketDailyUsage.associate = (models) => {

    TicketDailyUsage.belongsTo(models.Ticket, {
      foreignKey: "ticket_id",
      as: "ticket"
    });

    TicketDailyUsage.belongsTo(models.Event, {
      foreignKey: "event_id",
      as: "event"
    });

  };

  return TicketDailyUsage;

};