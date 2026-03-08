const service = require("../../services/dash/fasilitas.service");
const processImage = require("../../utils/imageProcessor");

module.exports = {

    async getPagination(req, res) {
        const { page = 1, perPage = 10, search = "" } = req.query;

        const result = await service.getPagination({
            page,
            perPage,
            search,
        });

        res.json({
            success: true,
            message: "Fasilitas retrieved",
            media: process.env.MEDIA_URL,
            data: result.rows,
            meta: {
                page: Number(page),
                perPage: Number(perPage),
                totalItems: result.count,
                totalPages: result.totalPages,
            },
        });
    },

    async getAll(req, res) {
        res.json({
            success: true,
            message: "Fasilitas retrieved",
            media: process.env.MEDIA_URL,
            data: await service.getAll()
        });
    },

    async store(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    status: false,
                    message: "Validation error",
                    errors: ["icon file is required"]
                });
            }
            let icon = null;

            if (req.file) {
                icon = await processImage(req.file.buffer, "icons");
            }

            const author_id = req.user.id;

            const banner = await service.store({
                name: req.body.name,
                icon,
                author_id
            });

            res.status(201).json({ success: true, message: "Fasilitas created", data: banner });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },

    async update(req, res) {
        try {
            const checkFasilitas = await service.getOne(req.params.id);
            if (!checkFasilitas) {
                return res.status(404).json({ success: false, message: "Fasilitas not found" });
            }
            const data = {
                name: req.body.name,
            };

            if (req.file) {
                data.icon = await processImage(req.file.buffer, "icons");
            }

            const Fasilitas = await service.update(req.params.id, data);
            res.json({ success: true, message: "Fasilitas updated", data: Fasilitas });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },

    async destroy(req, res) {
        const checkFasilitas = await service.getOne(req.params.id);
        if (!checkFasilitas) {
            return res.status(404).json({ success: false, message: "Fasilitas not found" });
        }
        try {
            res.json({ success: true, message: "Fasilitas deleted", data: await service.delete(req.params.id) });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }
};