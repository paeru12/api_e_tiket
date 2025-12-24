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
      region_id: DataTypes.UUID,
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

      is_active: DataTypes.BOOLEAN,
      status: DataTypes.ENUM("draft", "published", "archived"),

      image: DataTypes.TEXT,
      layout_venue: DataTypes.TEXT,

      map: DataTypes.TEXT,
      location: DataTypes.STRING,
      keywords: DataTypes.TEXT,
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
    Event.belongsTo(models.Creator, { foreignKey: "creator_id" });
    Event.belongsTo(models.Region, { foreignKey: "region_id" });
    Event.belongsTo(models.Kategori, { foreignKey: "kategori_id" });
    Event.belongsTo(models.User, { foreignKey: "user_id" });
  };

  return Event;
};
