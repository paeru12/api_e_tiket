'use strict';

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    role_scope: DataTypes.ENUM("global", "creator")
  }, {
    tableName: 'roles',
    underscored: true
  });

  Role.associate = (models) => {
    Role.belongsToMany(models.User, {
      through: 'user_roles',
      foreignKey: 'role_id',
      otherKey: 'user_id'
    });

    Role.hasMany(models.CreatorUserMember, {
      foreignKey: 'role_id',
      as: 'creator_memberships'
    });
  };

  return Role;
};
