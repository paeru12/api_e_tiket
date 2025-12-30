const service = require("../../services/dash/region.service");
const processImage = require("../../utils/imageProcessor");

module.exports = {
    async index(req, res) {
        try {
            const data = await service.getAll();
            res.json({
                success: true,
                message: "Regions retrieved",
                data
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    async show(req, res) {
        try {
            const data = await service.getOne(req.params.id);
            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: "Region not found"
                });
            }

            res.json({
                success: true,
                message: "Region found",
                data
            });
        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message
            });
        }
    },

    async showBySlug(req, res) {
        try {
            const data = await service.getBySlug(req.params.slug);
            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: "Region not found"
                });
            }

            res.json({
                success: true,
                message: "Region found",
                data
            });
        } catch (err) {
            res.status(404).json({
                success: false,
                message: err.message
            });
        }
    },

    async store(req, res) {
        try {
            let imageUrl = null;

            if (req.file) {
                imageUrl = await processImage(req.file.buffer, "regions");
            }

            const region = await service.create({
                user_id: req.body.user_id,
                name: req.body.name,
                description: req.body.description,
                keywords: req.body.keywords,
                image: imageUrl
            });

            res.status(201).json({
                success: true,
                message: "Region created",
                data: region
            });
        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message
            });
        }
    },

    async update(req, res) {
        try {
            const checkRegion = await service.getOne(req.params.id);
            if (!checkRegion) {
                return res.status(404).json({
                    success: false,
                    message: "Region not found"
                });
            }

            const data = {
                user_id: req.body.user_id,
                name: req.body.name,
                description: req.body.description,
                keywords: req.body.keywords
            };

            // HANYA set image jika upload baru
            if (req.file) {
                data.image = await processImage(req.file.buffer, "regions");
            }

            const region = await service.update(req.params.id, data);

            res.json({
                success: true,
                message: "Region updated",
                data: region
            });
        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message
            });
        }
    },

    async destroy(req, res) {
        try {
            const checkRegion = await service.getOne(req.params.id);
            if (!checkRegion) {
                return res.status(404).json({
                    success: false,
                    message: "Region not found"
                });
            }

            const result = await service.remove(req.params.id);

            res.json({
                success: true,
                message: "Region deleted",
                data: result
            });
        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message
            });
        }
    },

    async seo(req, res) {
        try {
            const region = await service.getBySlug(req.params.slug);

            res.json({
                success: true,
                message: "Region SEO retrieved",
                data: {
                    title: `${region.name} | E-Tiket`,
                    description: region.description || `Event dan konser di ${region.name}`,
                    keywords: region.keywords || region.name,
                    image: region.image
                }
            });
        } catch (err) {
            res.status(404).json({
                success: false,
                message: err.message
            });
        }
    }
};
