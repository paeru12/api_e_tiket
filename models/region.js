module.exports = (sequelize, DataTypes) => {
  const Region = sequelize.define("Region", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: DataTypes.UUID,
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    description: DataTypes.TEXT,
    keywords: DataTypes.TEXT,
    image: DataTypes.TEXT
  }, {
    tableName: "regions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });

  Region.associate = (models) => {
    Region.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "users"
    });
  };
  
  return Region;
};
