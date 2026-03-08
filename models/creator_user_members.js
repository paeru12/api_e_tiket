module.exports = (sequelize, DataTypes) => {
  const CreatorUserMember = sequelize.define('CreatorUserMember', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    creator_id: {
      type: DataTypes.UUID,
    },
    user_id: {
      type: DataTypes.UUID,
    },
    role_id: {
      type: DataTypes.UUID,
    }
  }, {
    tableName: 'creator_user_members',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  CreatorUserMember.associate = (models) => {
    CreatorUserMember.belongsTo(models.Creator, {
      foreignKey: 'creator_id',
      as: 'creator'
    });
    CreatorUserMember.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    CreatorUserMember.belongsTo(models.Role, {
      foreignKey: 'role_id',
      as: 'role'
    });
  };

  return CreatorUserMember;
};
