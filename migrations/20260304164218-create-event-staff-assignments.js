"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("event_staff_assignments", {

      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("(UUID())"),
        primaryKey: true,
        allowNull: false
      },

      creator_id: {
        type: Sequelize.UUID,
        allowNull: false
      },

      event_id: {
        type: Sequelize.UUID,
        allowNull: false
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false
      },

      assigned_gate: {
        type: Sequelize.STRING(100),
        allowNull: false
      },

      role: {
        type: Sequelize.ENUM("scanner", "gate_admin"),
        defaultValue: "scanner"
      },

      status: {
        type: Sequelize.ENUM("pending", "accepted", "rejected"),
        defaultValue: "pending"
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },

      accepted_at: {
        type: Sequelize.DATE,
        allowNull: true
      },

      created_by: {
        type: Sequelize.UUID,
        allowNull: true
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }

    });

    // indexes
    await queryInterface.addIndex("event_staff_assignments", ["event_id"]);
    await queryInterface.addIndex("event_staff_assignments", ["user_id"]);
    await queryInterface.addIndex("event_staff_assignments", ["creator_id"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("event_staff_assignments");
  }
};