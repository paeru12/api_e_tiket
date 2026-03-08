const { Kategori, User } = require("../../../models");
const deleteImage = require("../../utils/deleteImage");
const slugify = require("../../utils/slugify");
const { Op } = require("sequelize");

async function generateUniqueSlug(name, excludeId = null) {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const where = excludeId
      ? { slug, id: { [Op.ne]: excludeId } }
      : { slug };

    const exists = await Kategori.findOne({ where });
    if (!exists) break;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

module.exports = {
  async getPagination({ page = 1, perPage = 10, search = "" }) {
    const limit = parseInt(perPage);
    const offset = (page - 1) * limit;

    const where = search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { keywords: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { rows, count } = await Kategori.findAndCountAll({
      where,
      limit,
      offset,
      order: [["created_at", "DESC"]],
      include: {
        model: User,
        as: "users",
        attributes: ["full_name"],
      },
    });

    return {
      rows,
      count,
      page,
      perPage: limit,
      totalPages: Math.ceil(count / limit),
    };
  },

  async getAll() {
    return await Kategori.findAll({ 
      order: [["created_at", "DESC"]], 
      include: {
        model: User,
        as: "users",
        attributes: ["full_name"]
      } });
  },

  async getOne(id) {
    const kategori = await Kategori.findByPk(id);
    if (!kategori) throw new Error("Kategori not found");
    return kategori;
  },

  async create(data) {
    const slug = await generateUniqueSlug(data.name);
 
    return await Kategori.create({
      user_id: data.user_id,
      name: data.name,
      slug,
      description: data.description,
      keywords: data.keywords,
      image: data.image
    });
  },

  async update(id, data) {
    const kategori = await Kategori.findByPk(id);
    if (!kategori) throw new Error("Kategori not found");

    if (data.name && data.name !== kategori.name) {
      data.slug = await generateUniqueSlug(data.name, id);
    }

    if (data.image && kategori.image) {
      deleteImage(kategori.image);
    }

    await kategori.update(data);
    return kategori;
  },

  async remove(id) {
    const kategori = await Kategori.findByPk(id);
    if (!kategori) throw new Error("Kategori not found");

    if (kategori.image) {
      deleteImage(kategori.image);
    }

    await kategori.destroy();
    return { message: "Kategori deleted" };
  }
};
