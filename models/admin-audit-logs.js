module.exports = (sequelize, DataTypes) => {
  return sequelize.define("AdminAuditLog", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: DataTypes.UUID,
    action: DataTypes.STRING,
    ip_address: DataTypes.STRING,
    user_agent: DataTypes.TEXT
  }, {
    tableName: "admin_audit_logs",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  });
};
