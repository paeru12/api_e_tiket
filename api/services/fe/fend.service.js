const { Kategori, Banner, Event, Creator, TicketType, GuestStars, Sponsors, Fasilitas } = require("../../../models");
const { Op, Sequelize } = require("sequelize");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 60 });
const { mapEvent } = require("../../utils/event.mapper");
const { buildPagination } = require("../../utils/pagination");

function mapEventHome(row) {
    return {
        id: row.id,

        image: row.image
            ? process.env.MEDIA_URL_FRONTEND + row.image
            : null,

        name: row.name,

        dateStart: row.date_start,
        timeStart: row.time_start,

        dateEnd: row.date_end,
        timeEnd: row.time_end,

        status: row.status,

        location: row.location,
        province: row.province,
        city: row.district,

        slug: row.slug,

        lowestPrice: row.lowest_price,

        creator: row.creators
            ? {
                name: row.creators.name,
                username: row.creators.slug,
                photoProfile: row.creators.image
                    ? process.env.MEDIA_URL_FRONTEND + row.creators.image
                    : null
            }
            : null
    };
}

module.exports = {

    async homeAll() {

        const cached = cache.get("home");

        if (cached) {
            return cached;
        }

        const now = new Date();

        const [
            banner,
            kategori,
            rekomendasi,
            terdekat,
            terlaris
        ] = await Promise.all([

            Banner.findAll({
                where: { is_active: true },
                order: [["created_at", "DESC"]],
                limit: 8
            }),

            Kategori.findAll({
                order: [["created_at", "DESC"]],
                limit: 8
            }),

            Event.findAll({
                where: { status: "published" },
                include: [
                    {
                        model: Creator,
                        as: "creators",
                        attributes: ["name", "slug", "image"]
                    }
                ],
                order: [["created_at", "DESC"]],
                limit: 8,
                attributes: [
                    "id",
                    "name",
                    "slug",
                    "image",
                    "date_start",
                    "time_start",
                    "date_end",
                    "time_end",
                    "status",
                    "location",
                    "province",
                    "district",
                    "lowest_price"
                ]
            }),

            Event.findAll({
                where: {
                    status: "published",
                    date_start: { [Op.gte]: now }
                },
                include: [
                    {
                        model: Creator,
                        as: "creators",
                        attributes: ["name", "slug", "image"]
                    }
                ],
                order: [["date_start", "ASC"]],
                limit: 8,
                attributes: [
                    "id",
                    "name",
                    "slug",
                    "image",
                    "date_start",
                    "time_start",
                    "date_end",
                    "time_end",
                    "status",
                    "location",
                    "province",
                    "district",
                    "lowest_price"
                ]
            }),

            Event.findAll({
                where: { status: "published" },
                include: [
                    {
                        model: TicketType,
                        as: "ticket_types",
                        attributes: [],
                        required: false
                    },
                    {
                        model: Creator,
                        as: "creators",
                        attributes: ["name", "slug", "image"]
                    }
                ],
                attributes: [
                    "id",
                    "name",
                    "slug",
                    "image",
                    "date_start",
                    "time_start",
                    "date_end",
                    "time_end",
                    "status",
                    "location",
                    "province",
                    "district",
                    "lowest_price",
                    [
                        Sequelize.fn(
                            "SUM",
                            Sequelize.col("ticket_types.ticket_sold")
                        ),
                        "total_sold"
                    ]
                ],
                group: ["Event.id"],
                order: [[Sequelize.literal("total_sold"), "DESC"]],
                limit: 8,
                subQuery: false
            })

        ]);

        const bannerData = banner.map((row) => ({
            id: row.id,
            name: row.name,
            image: row.image_banner
                ? process.env.MEDIA_URL_FRONTEND + row.image_banner
                : null,
            link: row.link
        }));

        const kategoriData = kategori.map((row) => ({
            name: row.name,
            slug: row.slug,
            icon: row.image
                ? process.env.MEDIA_URL_FRONTEND + row.image
                : null
        }));

        const rekomendasiData = rekomendasi.map(mapEventHome);
        const terdekatData = terdekat.map(mapEventHome);
        const terlarisData = terlaris.map(mapEventHome);

        const result = {
            banner: bannerData,
            kategori: kategoriData,
            rekomendasi: rekomendasiData,
            terlaris: terlarisData,
            terdekat: terdekatData
        };

        cache.set("home", result);

        return result;
    },

    async eventAll({ page = 1 }) {
        const limit = 8;
        const offset = (page - 1) * limit;

        const { rows, count } = await Event.findAndCountAll({
            where: {
                status: ["published", "ended"]
            },

            include: [
                {
                    model: Creator,
                    as: "creators",
                    attributes: ["name", "slug", "image"]
                }
            ],

            attributes: [
                "id",
                "name",
                "slug",
                "image",
                "date_start",
                "date_end",
                "time_start",
                "time_end",
                "status",
                "location",
                "province",
                "district",
                "lowest_price",
            ],

            order: [["created_at", "DESC"]],
            limit,
            offset
        });

        const totalPages = Math.ceil(count / limit);

        const data = rows.map((event) => ({
            id: event.id,
            image: event.image ? process.env.MEDIA_URL_FRONTEND + event.image : null,
            name: event.name,

            dateStart: event.date_start,
            timeStart: event.time_start,
            dateEnd: event.date_end,
            timeEnd: event.time_end,
            status: event.status,

            location: event.location,
            province: event.province,
            city: event.district,

            slug: event.slug,
            lowestPrice: event.lowest_price,

            creator: event.creators
                ? {
                    name: event.creators.name,
                    username: event.creators.slug,
                    photoProfile: event.creators.image ? process.env.MEDIA_URL_FRONTEND + event.creators.image : null
                }
                : null
        }));

        return {
            currentPage: page,
            limit,
            totalCount: count,
            totalPages,
            nextPage: page < totalPages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            data
        };
    },

    async getEventByKategoriSlug({ slug, page = 1 }) {

        const limit = 8;
        const offset = (page - 1) * limit;

        const { rows, count } = await Event.findAndCountAll({

            include: [
                {
                    model: Kategori,
                    as: "kategoris",
                    where: { slug: slug },
                    attributes: []
                },
                {
                    model: Creator,
                    as: "creators",
                    attributes: ["name", "slug", "image"]
                }
            ],

            where: {
                status: ["published", "ended"]
            },

            order: [["created_at", "DESC"]],

            limit,
            offset,

            attributes: [
                "id",
                "name",
                "slug",
                "image",

                "date_start",
                "time_start",

                "date_end",
                "time_end",

                "status",

                "location",
                "province",
                "district",

                "lowest_price"
            ]
        });

        const totalPages = Math.ceil(count / limit);

        const data = rows.map(mapEventHome);

        return {
            currentPage: page,
            limit,
            totalCount: count,
            totalPages,
            nextPage: page < totalPages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            data
        };
    },

    async kategoriAll() {
        const kategori = await Kategori.findAll({ order: [["created_at", "DESC"]], limit: 8 });
        const data = kategori.map((row) => ({
            name: row.name,
            slug: row.slug,
            icon: row.image ? process.env.MEDIA_URL_FRONTEND + row.image : null,
        }));
        return data;
    },

    async getOneEvent(slug) {

        const event = await Event.findOne({
            where: { slug },

            include: [
                {
                    model: Kategori,
                    as: "kategoris",
                    attributes: ["name", "slug", "image"]
                },
                {
                    model: Creator,
                    as: "creators",
                    attributes: ["name", "slug", "image"]
                },
                {
                    model: GuestStars,
                    as: "guest_stars",
                    attributes: ["name", "image"]
                },
                {
                    model: Sponsors,
                    as: "sponsors",
                    attributes: ["name", "image"]
                },
                {
                    model: Fasilitas,
                    as: "fasilitas_event",
                    through: { attributes: [] },
                    attributes: ["name", "icon"]
                }
            ],

            paranoid: false
        });

        if (!event) return null;

        const social = event.social_link
            ? JSON.parse(event.social_link)
            : {};

        return {

            id: event.id,
            slug: event.slug,
            name: event.name,

            image: event.image ? process.env.MEDIA_URL_FRONTEND + event.image : null,
            description: event.deskripsi,

            location: event.location,
            province: event.province,
            city: event.district,

            map: event.map,
            eventLayoutVenue: event.layout_venue ? process.env.MEDIA_URL_FRONTEND + event.layout_venue : null,

            dateStart: event.date_start,
            dateEnd: event.date_end,
            timeStart: event.time_start,
            timeEnd: event.time_end,

            sk: event.sk,

            lowestPrice: event.lowest_price,

            keywords: event.keywords
                ? event.keywords.split(",")
                : [],

            socialLink: {
                instagram: social?.instagram || null,
                tiktok: social?.tiktok || null,
                facebook: social?.facebook || null,
                youtube: social?.youtube || null,
                website: social?.website || null
            },

            category: event.kategoris
                ? {
                    name: event.kategoris.name,
                    slug: event.kategoris.slug,
                    image: event.kategoris.image ? process.env.MEDIA_URL_FRONTEND + event.kategoris.image : null,
                }
                : null,

            creator: event.creators
                ? {
                    name: event.creators.name,
                    slug: event.creators.slug,
                    image: event.creators.image ? process.env.MEDIA_URL_FRONTEND + event.creators.image : null,
                }
                : null,

            guestStars: event.guest_stars.map(g => ({
                name: g.name,
                image: g.image ? process.env.MEDIA_URL_FRONTEND + g.image : null,
            })),

            sponsors: event.sponsors.map(s => ({
                name: s.name,
                image: s.image ? process.env.MEDIA_URL_FRONTEND + s.image : null,
            })),

            facilities: event.fasilitas_event.map(f => ({
                name: f.name,
                icon: f.icon ? process.env.MEDIA_URL_FRONTEND + f.icon : null,
            }))
        };
    },

    async getTicketEvent(slug) {

        const event = await Event.findOne({
            where: { slug },

            include: [
                {
                    model: TicketType,
                    as: "ticket_types",
                    attributes: [
                        "id",
                        "event_id",
                        "name",
                        "deskripsi",
                        "price",
                        "total_stock",
                        "ticket_sold",
                        "max_per_order",
                        "reserved_stock",
                        "status",
                        "date_start",
                        "date_end",
                        "time_start",
                        "time_end"
                    ]
                }
            ],

            attributes: ["id"]
        });

        if (!event) return [];

        return event.ticket_types.map((ticket) => {

            const stock =
                (ticket.total_stock || 0) -
                (ticket.ticket_sold || 0) -
                (ticket.reserved_stock || 0);

            let status = "Available";

            if (stock <= 0) status = "Sold Out";
            if (ticket.status === "closed") status = "Closed";

            return {
                id: ticket.id,
                eventId: ticket.event_id,
                name: ticket.name,
                ticketDescription: ticket.deskripsi,
                stock: stock < 0 ? 0 : stock,
                ticketPerTransaction: ticket.max_per_order,
                price: ticket.price,
                ticketDescription: ticket.deskripsi,
                dateStart: ticket.date_start,
                dateEnd: ticket.date_end,
                timeStart: ticket.time_start,
                timeEnd: ticket.time_end,
                status
            };
        });
    },

    async bannerAll() {
        return await Banner.findAll({ order: [["created_at", "DESC"]], limit: 5 });
    },

    //search 
    async searchEvents({
        page = 1,
        limit = 8,
        search,
        category,
        city,
        province,
        status,
        sort
    }) {

        const offset = (page - 1) * limit;

        let where = {};
        let order = [["created_at", "DESC"]];

        if (status) {
            where.status = status;
        } else {
            where.status = ["published", "ended"];
        }

        if (search) {
            where.name = {
                [Op.like]: `%${search}%`
            };
        }

        if (city) {
            where.district = {
                [Op.like]: `%${city}%`
            };
        }

        if (province) {
            where.province = {
                [Op.like]: `%${province}%`
            };
        }

        if (sort === "latest") {
            order = [["created_at", "DESC"]];
        }

        if (sort === "price_low") {
            order = [["lowest_price", "ASC"]];
        }

        if (sort === "price_high") {
            order = [["lowest_price", "DESC"]];
        }

        if (sort === "upcoming") {
            order = [["date_start", "ASC"]];
        }

        if (sort === "popular") {
            order = [[Sequelize.literal("total_sold"), "DESC"]];
        }

        const include = [
            {
                model: Creator,
                as: "creators",
                attributes: ["name", "slug", "image"]
            }
        ];

        if (category) {
            include.push({
                model: Kategori,
                as: "kategoris",
                where: { slug: category },
                attributes: []
            });
        }

        if (sort === "popular") {
            include.push({
                model: TicketType,
                as: "ticket_types",
                attributes: [],
                required: false
            });
        }

        const attributes = [
            "id",
            "name",
            "slug",
            "image",
            "date_start",
            "time_start",
            "date_end",
            "time_end",
            "status",
            "location",
            "province",
            "district",
            "lowest_price"
        ];

        if (sort === "popular") {
            attributes.push([
                Sequelize.fn(
                    "SUM",
                    Sequelize.col("ticket_types.ticket_sold")
                ),
                "total_sold"
            ]);
        }

        const { rows, count } = await Event.findAndCountAll({
            where,
            include,
            attributes,
            group: sort === "popular" ? ["Event.id"] : undefined,
            order,
            limit,
            offset,
            subQuery: false
        });

        const data = rows.map(mapEvent);
        const searching = {
            ...buildPagination(page, limit, count),
            data
        };
        cache.set("searching", searching);
        
        return searching;
    }
};
