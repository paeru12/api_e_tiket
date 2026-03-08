const { Banner, User, sequelize } = require("../../../models");
const deleteImage = require("../../utils/deleteImage");
const { Op } = require("sequelize");

module.exports = {
  async getPagination({ page = 1, perPage = 10, search = "" }) {
    const limit = parseInt(perPage);
    const offset = (page - 1) * limit;

    const where = search
      ? { name: { [Op.like]: `%${search}%` } }
      : {};

    const { rows, count } = await Banner.findAndCountAll({
      where,
      limit,
      offset,
      include: {
        model: User,
        as: "author",
        attributes: ["full_name"]
      },
      order: [["created_at", "DESC"]]
    });

    return {
      rows,
      count,
      page,
      perPage: limit,
      totalPages: Math.ceil(count / limit)
    };
  },

  async getAll() {
    return await Banner.findAll({
      order: [["created_at", "DESC"]],
      include: {
        model: User,
        as: "author",
        attributes: ["full_name"]
      }
    });
  },

  async getOne(id) {
    return await Banner.findByPk(id);
  },

  async create(data) {
    return await Banner.create({
      author_id: data.author_id,
      name: data.name,
      link: data.link,
      is_active: data.is_active,
      image_banner: data.image_banner
    });
  },

  async update(id, data) {
    const banner = await Banner.findByPk(id);
    if (!banner) throw new Error("Banner not found");

    if (data.image_banner && banner.image_banner) {
      deleteImage(banner.image_banner);
    }

    await banner.update(data);
    return banner;
  },

  async remove(id) {
    const banner = await Banner.findByPk(id);
    if (!banner) throw new Error("Banner not found");

    if (banner.image_banner) deleteImage(banner.image_banner);

    await banner.destroy();
    return { message: "Banner deleted" };
  }
};
