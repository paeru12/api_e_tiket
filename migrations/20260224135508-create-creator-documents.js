'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('creator_documents', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("(UUID())"),
        allowNull: false,
        primaryKey: true
      },
      creator_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      // personal identity
      ktp_number: { type: Sequelize.STRING(50) },
      ktp_image: { type: Sequelize.TEXT },

      npwp_number: { type: Sequelize.STRING(50) },
      npwp_image: { type: Sequelize.TEXT },

      // Legal entity (PT / CV / Yayasan / Perorangan)
      legal_type: { type: Sequelize.STRING(50) },
      legal_name: { type: Sequelize.STRING(150) },
      legal_doc: { type: Sequelize.TEXT },

      // Extra
      additional_docs: { type: Sequelize.JSON },

      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE

    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('creator_documents');
  }
};