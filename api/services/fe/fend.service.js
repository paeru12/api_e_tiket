const { Kategori, Region, Event, Creator, TicketType } = require("../../../models");

module.exports = {

    async homeAll() {
        const event = await Event.findAll({
            where: { status: ["published", "ended"] },
            order: [["created_at", "DESC"]],
            limit: 10,
            attributes: [
                "id",
                "name",
                "slug",
                "date_start",
                "image",
                "status",
                "lowest_price",
            ],
            include: [
                {
                    model: Region,
                    attributes: ["name", "slug"],
                    as: "regions",
                }
            ],
            group: [
                "Event.id",
                "regions.id"
            ]
        });

        const kategori = await Kategori.findAll({ order: [["created_at", "DESC"]], limit: 8 });
        const region = await Region.findAll({ order: [["created_at", "DESC"]], limit: 8 });

        return { event, kategori, region };
    },

    async kategoriAll() {
        return await Kategori.findAll({ order: [["created_at", "DESC"]], limit: 8 });
    },

    async getEventByKategoriSlug(slug) {
        return await Event.findAll({
            include: [
                {
                    model: Kategori,
                    as: "kategoris",
                    where: { slug: slug },
                    attributes: [],
                },
            ],
            where: { status: ["published", "ended"] },
            order: [["created_at", "DESC"]],
            limit: 10,
            attributes: [
                "id",
                "name",
                "slug",
                "date_start",
                "image",
                "status",
                "lowest_price",
            ],
            include: [
                {
                    model: Region,
                    attributes: ["name", "slug"],
                    as: "regions",
                }
            ],
            group: [
                "Event.id",
                "regions.id"
            ]
        });
    },

    async regionAll() {
        return await Region.findAll({ order: [["created_at", "DESC"]], limit: 8 });
    },

    async getEventByRegionSlug(slug) {
        return await Event.findAll({
            include: [
                {
                    model: Region,
                    as: "regions",
                    where: { slug: slug },
                    attributes: [],
                },
            ],
            where: { status: ["published", "ended"] },
            order: [["created_at", "DESC"]],
            limit: 10,
            attributes: [
                "id",
                "name",
                "slug",
                "date_start",
                "image",
                "status",
                "lowest_price",
            ],
            include: [
                {
                    model: Kategori,
                    attributes: ["name", "slug"],
                    as: "kategoris",
                }
            ],
            group: [
                "Event.id",
                "kategoris.id"
            ]
        });
    },

    async eventAll() {
        return await Event.findAll({
            where: { status: ["published", "ended"] },
            order: [["created_at", "DESC"]],
            limit: 10,
            attributes: [
                "id",
                "name",
                "slug",
                "date_start",
                "image",
                "status",
                "lowest_price",
            ],
            include: [
                {
                    model: Region,
                    attributes: ["name", "slug"],
                    as: "regions",
                }
            ],
            group: [
                "Event.id",
                "regions.id"
            ]
        });
    },

    async getOneEvent(slug) {
        return await Event.findAll({
            where: { slug: slug },
            include: [
                {
                    model: Kategori,
                    attributes: ["name", "slug", "image"],
                    as: "kategoris",
                },
                {
                    model: Region,
                    attributes: ["name", "slug", "image"],
                    as: "regions",
                },
                {
                    model: Creator,
                    attributes: ["name", "slug", "image"],
                    as: "creators",
                },
            ],
            group: [
                "Event.id",
                "regions.id",
                "kategoris.id",
                "creators.id"
            ]
        });
    },

    async getTicketEvent(slug) {
        return await Event.findAll({
            where: { slug: slug },
            include: [
                {
                    model: TicketType,
                    as: "ticket_types",
                },
            ],
            attributes: ["id", "name", "slug", "date_start", "time_start", "time_end", "image", "status"],
        });
    }

    //   async bannerAll() {
    //     return await Banner.findAll({ order: [["created_at", "DESC"]], limit: 5 });
    //   }

};
