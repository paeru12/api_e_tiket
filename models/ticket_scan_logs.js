module.exports = (sequelize, DataTypes) => {

  const TicketScanLog = sequelize.define(
    "TicketScanLog",
    {

      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      creator_id: DataTypes.UUID,

      ticket_id: DataTypes.UUID,

      event_id: DataTypes.UUID,

      scanned_by: DataTypes.UUID,

      gate: DataTypes.STRING,

      device_id: DataTypes.STRING,

      scan_source: DataTypes.STRING,

      raw_qr_payload: DataTypes.TEXT,

      result: {
        type: DataTypes.ENUM(
          "success",
          "duplicate",
          "invalid",
          "wrong_event"
        )
      },

      message: DataTypes.STRING,

      scanned_at: DataTypes.DATE

    },
    {
      tableName: "ticket_scan_logs",
      timestamps: false
    }
  );

  TicketScanLog.associate = (models) => {

    TicketScanLog.belongsTo(models.Ticket, {
      foreignKey: "ticket_id",
      as: "ticket"
    });

    TicketScanLog.belongsTo(models.Event, {
      foreignKey: "event_id",
      as: "event"
    });

  };

  return TicketScanLog;

};