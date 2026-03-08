module.exports = (sequelize, DataTypes) => {
  const TicketType = sequelize.define(
    "TicketType",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      event_id: DataTypes.UUID,
      name: DataTypes.STRING,
      deskripsi: DataTypes.TEXT,
      price: DataTypes.DECIMAL,
      total_stock: DataTypes.BIGINT,
      ticket_sold: DataTypes.BIGINT,
      max_per_order: DataTypes.BIGINT,
      reserved_stock: DataTypes.BIGINT,
      admin_fee_included: DataTypes.BOOLEAN,
      tax_included: DataTypes.BOOLEAN,
      status: DataTypes.ENUM("draft", "available", "closed"),
      ticket_usage_type: DataTypes.ENUM("single_entry", "daily_entry", "multi_entry"),
      deliver_ticket: DataTypes.DATE,
      date_start: DataTypes.DATE,
      date_end: DataTypes.DATE,
      time_start: DataTypes.TIME,
      time_end: DataTypes.TIME,
    },
    {
      tableName: "ticket_types",
      paranoid: true,
      underscored: true,
    }
  );

  TicketType.associate = (models) => {
    TicketType.belongsTo(models.Event, {
      foreignKey: "event_id",
      as: "event",
    });
    TicketType.hasMany(models.Ticket, {
      foreignKey: "ticket_type_id",
      as: "tickets",
    });
  };

  return TicketType;
};
