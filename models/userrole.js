module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    role_id: {
      type: DataTypes.UUID,
      primaryKey: true
    }
  }, {
    tableName: 'user_roles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true
  });

  UserRole.associate = (models) => {
    UserRole.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    UserRole.belongsTo(models.Role, {
      foreignKey: 'role_id',
      as: 'role'
    });
  };

  return UserRole;
};
