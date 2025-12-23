const { Region } = require("../../models");
const deleteImage = require("../utils/deleteImage");
const slugify = require("../utils/slugify");
const { Op } = require("sequelize");

async function generateUniqueSlug(name, excludeId = null) {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const where = excludeId
      ? { slug, id: { [Op.ne]: excludeId } }
      : { slug };

    const exists = await Region.findOne({ where });
    if (!exists) break;

    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
}

module.exports = {
  async getAll() {
    return await Region.findAll({ order: [["created_at", "DESC"]] });
  },

  async getOne(id) {
    const region = await Region.findByPk(id);
    if (!region) throw new Error("Region not found");
    return region;
  },

  async getBySlug(slug) {
    const region = await Region.findOne({ where: { slug } });
    if (!region) throw new Error("Region not found");
    return region;
  },

  async create(data) {
    const slug = await generateUniqueSlug(data.name);

    return await Region.create({
      user_id: data.user_id,
      name: data.name, 
      slug,
      description: data.description,
      keywords: data.keywords,
      image: data.image || null
    });
  },

  async update(id, data) {
    const region = await Region.findByPk(id);
    if (!region) throw new Error("Region not found");

    if (data.name && data.name !== region.name) {
      data.slug = await generateUniqueSlug(data.name, id);
    }

    if (data.image && region.image) {
      deleteImage(region.image);
    }

    await region.update({
      user_id: data.user_id ?? region.user_id,
      name: data.name ?? region.name,
      slug: data.slug ?? region.slug,
      description: data.description ?? region.description,
      keywords: data.keywords ?? region.keywords,
      image: data.image ?? region.image
    });

    return region;
  },

  async remove(id) {
    const region = await Region.findByPk(id);
    if (!region) throw new Error("Region not found");

    if (region.image) deleteImage(region.image);
    await region.destroy();

    return { message: "Region deleted" };
  }
};
