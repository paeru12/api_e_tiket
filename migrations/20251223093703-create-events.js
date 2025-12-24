"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("events", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("(UUID())"),
        allowNull: false,
        primaryKey: true,
      },

      creator_id: { type: Sequelize.UUID, allowNull: false },
      region_id: { type: Sequelize.UUID, allowNull: false },
      kategori_id: { type: Sequelize.UUID, allowNull: false },
      user_id: { type: Sequelize.UUID, allowNull: false },

      name: { type: Sequelize.STRING(150), allowNull: false },
      slug: { type: Sequelize.TEXT, allowNull: false },

      deskripsi: { type: Sequelize.TEXT, allowNull: true },
      sk: { type: Sequelize.TEXT, allowNull: true },

      date_start: { type: Sequelize.DATE, allowNull: true },
      date_end: { type: Sequelize.DATE, allowNull: true },

      time_start: { type: Sequelize.TIME, allowNull: true },
      time_end: { type: Sequelize.TIME, allowNull: true },

      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },

      status: {
        type: Sequelize.ENUM("draft", "published", "archived"),
        allowNull: false,
        defaultValue: "draft",
      },

      image: { type: Sequelize.TEXT, allowNull: true },
      layout_venue: { type: Sequelize.TEXT, allowNull: true },

      map: { type: Sequelize.TEXT, allowNull: true },
      location: { type: Sequelize.STRING, allowNull: true },
      keywords: { type: Sequelize.TEXT, allowNull: true },

      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE },
      deleted_at: { type: Sequelize.DATE },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("events");
  },
};
