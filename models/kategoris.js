module.exports = (sequelize, DataTypes) => {
  const Kategori = sequelize.define("Kategori", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: DataTypes.UUID,
    name: DataTypes.STRING,
    slug: DataTypes.TEXT,
    description: DataTypes.TEXT,
    keywords: DataTypes.TEXT,
    image: DataTypes.TEXT
  }, {
    tableName: "kategoris",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });

  return Kategori;
};
