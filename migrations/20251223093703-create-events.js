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
      timezone: { type: Sequelize.STRING, allowNull: true },

      status: {
        type: Sequelize.ENUM("draft", "published", "ended"),
        allowNull: false,
        defaultValue: "draft",
      },

      image: { type: Sequelize.TEXT, allowNull: true },
      layout_venue: { type: Sequelize.TEXT, allowNull: true },

      map: { type: Sequelize.TEXT, allowNull: true },
      location: { type: Sequelize.STRING, allowNull: true },
      province: { type: Sequelize.STRING, allowNull: true },
      district: { type: Sequelize.STRING, allowNull: true },

      keywords: { type: Sequelize.TEXT, allowNull: true },
      lowest_price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      total_ticket_sold: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
      },
      social_link: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE },
      deleted_at: { type: Sequelize.DATE },
    });

    // INDEXES (WAJIB UNTUK PERFORMA)
    await queryInterface.addIndex("events", ["province"]);
    await queryInterface.addIndex("events", ["creator_id"]);
    await queryInterface.addIndex("events", ["kategori_id"]);
    await queryInterface.addIndex("events", ["status"]);
    await queryInterface.addIndex("events", ["date_start"]);
    await queryInterface.addIndex("events", ["created_at"]);
    await queryInterface.addIndex("events", ["total_ticket_sold"]);
    await queryInterface.addIndex(
      "events",
      ["status", "created_at"],
      {
        name: "idx_events_status_created"
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("events");
  },
};
