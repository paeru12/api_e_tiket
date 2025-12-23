module.exports = (sequelize, DataTypes) => {
  return sequelize.define("AdminRefreshToken", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: DataTypes.UUID,
    token: DataTypes.TEXT,
    expires_at: DataTypes.DATE,
    created_at: DataTypes.DATE
  }, {
    tableName: "admin_refresh_tokens",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  });
};
