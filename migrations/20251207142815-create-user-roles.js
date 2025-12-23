'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_roles', {
      user_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      role_id: {
        type: Sequelize.UUID,
        allowNull: false
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

    // Composite Primary Key
    await queryInterface.addConstraint('user_roles', {
      fields: ['user_id', 'role_id'],
      type: 'primary key',
      name: 'pk_user_roles'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('user_roles');
  }
};
