'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    full_name: DataTypes.STRING,
    phone: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    is_email_verified: DataTypes.BOOLEAN,
    failed_login_attempts: DataTypes.INTEGER,
    is_locked: DataTypes.BOOLEAN,
    locked_at: DataTypes.DATE,
    image: DataTypes.TEXT
  }, {
    tableName: 'users',
    paranoid: true,
    underscored: true
  });

  User.associate = (models) => {
    User.belongsToMany(models.Role, {
      through: 'user_roles',
      foreignKey: 'user_id',
      otherKey: 'role_id'
    });
  };

  return User;
};
