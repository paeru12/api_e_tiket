"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("kategoris", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('(UUID())'),
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      slug: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      keywords: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      image: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("kategoris");
  }
};
