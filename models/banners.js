"use strict";
module.exports = (sequelize, DataTypes) => {
  const Banner = sequelize.define(
    "Banner",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      author_id: DataTypes.UUID,
      name: DataTypes.STRING,
      image_banner: DataTypes.TEXT,
      link: DataTypes.TEXT,
      is_active: DataTypes.BOOLEAN
    },
    {
      tableName: "banners",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true,
      deletedAt: "deleted_at"
    }
  );

  Banner.associate = (models) => {
    Banner.belongsTo(models.User, {
      foreignKey: "author_id",
      as: "author"
    });
  };

  return Banner;
};
