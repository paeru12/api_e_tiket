module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    "Event",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      creator_id: DataTypes.UUID,
      kategori_id: DataTypes.UUID,
      user_id: DataTypes.UUID,

      name: DataTypes.STRING,
      slug: DataTypes.TEXT,

      deskripsi: DataTypes.TEXT,
      sk: DataTypes.TEXT,

      date_start: DataTypes.DATE,
      date_end: DataTypes.DATE,
      time_start: DataTypes.TIME,
      time_end: DataTypes.TIME,
      timezone: DataTypes.STRING,

      status: DataTypes.ENUM("draft", "published", "ended"),

      image: DataTypes.TEXT,
      layout_venue: DataTypes.TEXT,

      map: DataTypes.TEXT,
      location: DataTypes.STRING,
      province: DataTypes.STRING,
      district: DataTypes.STRING,
      keywords: DataTypes.TEXT,
      lowest_price: DataTypes.DECIMAL(15, 2),
      total_ticket_sold: DataTypes.BIGINT,
      social_link: { type: DataTypes.JSON, allowNull: true }
    },
    {
      tableName: "events",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true,
      deletedAt: "deleted_at",
      underscored: true,
    }
  );

  Event.associate = (models) => {
    Event.belongsTo(models.Creator, { foreignKey: "creator_id", as: "creators" });
    Event.belongsTo(models.Kategori, { foreignKey: "kategori_id", as: "kategoris" });
    Event.belongsTo(models.User, { foreignKey: "user_id", as: "users" });
    Event.hasMany(models.TicketType, { foreignKey: "event_id", as: "ticket_types" });
    Event.hasMany(models.GuestStars, { foreignKey: "event_id", as: "guest_stars" });
    Event.hasMany(models.Sponsors, { foreignKey: "event_id", as: "sponsors" });
    Event.hasMany(models.EventFasilitas, { foreignKey: 'event_id', as: 'fasilitas' });
    Event.belongsToMany(models.Fasilitas, {
      through: models.EventFasilitas,
      foreignKey: 'event_id',
      otherKey: 'fasilitas_id',
      as: 'fasilitas_event'
    });
    Event.hasMany(models.EventStaffAssignment, {foreignKey: "event_id", as: "scan_staffs" });
  };

  return Event;
};
