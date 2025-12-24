const { Event, Creator, Region, Kategori, User } = require("../../models");
const slugify = require("../utils/slugify");
const deleteImage = require("../utils/deleteImage");

module.exports = {
  async getAll() {
    return await Event.findAll({
      order: [["created_at", "DESC"]],
      attributes: { exclude: ["deleted_at"] },
      include: [
        { model: User, attributes: ['full_name', 'image'] },
        { model: Creator, attributes: ['name', 'slug'] },
        { model: Region, attributes: ['name', 'slug'] },
        { model: Kategori, attributes: ['name', 'slug'] },
      ],
    });
  },

  async getOne(id) {
    return await Event.findByPk(id, {
      include: [
        { model: User, attributes: ['full_name', 'image'] },
        { model: Creator, attributes: ['name', 'slug'] },
        { model: Region, attributes: ['name', 'slug'] },
        { model: Kategori, attributes: ['name', 'slug'] },
      ],
      paranoid: false, // bila ingin bisa mengambil soft delete
    });
  },

  async getBySlug(slug) {
    return await Event.findOne({
      where: { slug: slug },
      attributes: { exclude: ["user_id","kategori_id","region_id","creator_id","created_at","updated_at","deleted_at"] },
      include: [
        { model: User, attributes: ['full_name', 'image'] },
        { model: Creator, attributes: ['name', 'slug'] },
        { model: Region, attributes: ['name', 'slug'] },
        { model: Kategori, attributes: ['name', 'slug'] },
      ],
    });
  },  

  async create(data) {
    data.slug = slugify(data.name);
    return await Event.create(data);
  },

  async update(id, data) {
    const event = await Event.findByPk(id);
    if (!event) throw new Error("Event not found");

    if (data.name) data.slug = slugify(data.name);

    if (data.image && event.image) deleteImage(event.image);
    if (data.layout_venue && event.layout_venue) deleteImage(event.layout_venue);

    await event.update(data);
    return event;
  },

  async remove(id) {
    const event = await Event.findByPk(id);
    if (!event) throw new Error("Event not found");

    await event.destroy();
    return { message: "Event deleted" };
  },
};
