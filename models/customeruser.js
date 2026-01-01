module.exports = (sequelize, DataTypes) => {
  const CustomerUser = sequelize.define(
    "CustomerUser",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      photo_url: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      tableName: "customer_users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true,
      underscored: true
    }
  );
 
  CustomerUser.associate = (models) => {
    CustomerUser.hasMany(models.Order, {foreignKey: "customer_id", as: "orders"});
  };

  return CustomerUser;
};
