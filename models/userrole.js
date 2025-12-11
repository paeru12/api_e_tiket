module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true     // ⬅ WAJIB
    },
    role_id: {
      type: DataTypes.UUID,
      primaryKey: true     // ⬅ WAJIB
    }
  }, {
    tableName: 'user_roles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true
  });

  return UserRole;
};
