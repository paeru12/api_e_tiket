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
      is_active: DataTypes.BOOLEAN,
      status: DataTypes.ENUM("draft", "published", "closed"),
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
  };

  return TicketType;
};
