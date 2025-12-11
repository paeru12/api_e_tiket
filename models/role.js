'use strict';

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING
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
  };

  return Role;
};
