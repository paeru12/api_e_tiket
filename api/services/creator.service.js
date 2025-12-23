const { Creator } = require("../../models");
const deleteImage = require("../utils/deleteImage");
const slugify = require("../utils/slugify");

module.exports = {
  async getAll() {
    return await Creator.findAll({ order: [["created_at", "DESC"]] });
  },

  async getOne(id) {
    return await Creator.findByPk(id);
  },

  async getBySlug(slug) {
    return await Creator.findOne({ where: { slug } });
  },

  async create(data) {
    data.slug = slugify(data.name);
    return await Creator.create(data);
  },

  async update(id, data) {
    const creator = await Creator.findByPk(id);
    if (!creator) throw new Error("Creator not found");

    if (data.name) data.slug = slugify(data.name);

    if (data.image && creator.image) {
      deleteImage(creator.image);
    }

    await creator.update(data);
    return creator;
  },

  async remove(id) {
    const creator = await Creator.findByPk(id);
    if (!creator) throw new Error("Creator not found");

    if (creator.image) deleteImage(creator.image);

    await creator.destroy();
    return { message: "Creator deleted" };
  },
};
