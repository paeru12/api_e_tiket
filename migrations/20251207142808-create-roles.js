"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("roles", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('(UUID())'),
        allowNull: false,
        primaryKey: true
      },

      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },

      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });

    // Insert default roles
    await queryInterface.bulkInsert("roles", [
      { name: "SUPERADMIN", description: "Full system access", created_at: new Date(), updated_at: new Date() },
      { name: "EVENT_ADMIN", description: "Manage events & tickets", created_at: new Date(), updated_at: new Date() },
      { name: "SCAN_STAFF", description: "Ticket scanner staff", created_at: new Date(), updated_at: new Date() }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("roles");
  },
};
