const { Fasilitas, User } = require("../../../models");
const deleteImage = require("../../utils/deleteImage");
const { Op } = require("sequelize");

module.exports = {
    async getPagination({ page = 1, perPage = 10, search = "" }) {
        const limit = parseInt(perPage);
        const offset = (page - 1) * limit;

        const where = search
            ? {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                ],
            }
            : {};

        const { rows, count } = await Fasilitas.findAndCountAll({
            where,
            limit,
            offset,
            order: [["created_at", "DESC"]],
            include: {
                model: User,
                as: "author",
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
        return await Fasilitas.findAll({
            order: [["created_at", "DESC"]]
        });
    },

    async getOne(id) {
        const xfasilitas = await Fasilitas.findByPk(id);
        if (!xfasilitas) throw new Error("Fasilitas not found");
        return xfasilitas;
    },

    async store(data) {
        return await Fasilitas.create(data);
    },

    async update(id, data) {
        const xfasilitas = await Fasilitas.findByPk(id);
        if (!xfasilitas) throw new Error("Fasilitas not found");

        if (data.icon && xfasilitas.icon) {
            deleteImage(xfasilitas.icon);
        }
        await xfasilitas.update(data);
        return xfasilitas;
    },

    async delete(id) {
        const xfasilitas = await Fasilitas.findByPk(id);
        if (!xfasilitas) throw new Error("Fasilitas not found");

        if (xfasilitas.icon) {
            deleteImage(xfasilitas.icon);
        }

        await xfasilitas.destroy();
        return { message: "Fasilitas deleted" };
    }

};