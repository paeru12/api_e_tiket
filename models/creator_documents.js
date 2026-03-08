"use strict";
module.exports = (sequelize, DataTypes) => {
  const CreatorDocuments = sequelize.define(
    "CreatorDocuments",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      creator_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      ktp_number: { type: DataTypes.STRING(50) },
      ktp_image: { type: DataTypes.TEXT },

      npwp_number: { type: DataTypes.STRING(50) },
      npwp_image: { type: DataTypes.TEXT },

      // Legal entity (PT / CV / Yayasan / Perorangan)
      legal_type: { type: DataTypes.STRING(50) },
      legal_name: { type: DataTypes.STRING(150) },
      legal_doc: { type: DataTypes.TEXT },

      // Extra
      additional_docs: { type: DataTypes.JSON },
    },
    {
      tableName: "creator_documents",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true,
      deletedAt: "deleted_at",
      underscored: true,
    }

  );

  return CreatorDocuments;
};
