module.exports = (sequelize, DataTypes) => {
  const Creator = sequelize.define(
    "Creator",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: DataTypes.UUID,
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },

      slug: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "creators",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true,
      deletedAt: "deleted_at",
      underscored: true,
    }
  );

  return Creator;
};
