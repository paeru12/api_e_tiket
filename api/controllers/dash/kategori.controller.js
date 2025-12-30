const service = require("../../services/dash/kategori.service");
const processImage = require("../../utils/imageProcessor");

module.exports = {
    async index(req, res) {
        res.json({ success: true, message: "Kategori retrieved", data: await service.getAll() });
    },

    async show(req, res) {
        const data = await service.getOne(req.params.id);
        if (!data) {
            return res.status(404).json({ success: false, message: "Kategori not found" });
        }
        res.json({ success: true, message: "Kategori found", data: data });
    }, 

    async store(req, res) {
        try {
            let imageUrl = null;

            if (req.file) {
                imageUrl = await processImage(req.file.buffer, "kategoris");
            }

            const kategori = await service.create({
                user_id: req.body.user_id,
                name: req.body.name,
                description: req.body.description,
                keywords: req.body.keywords,
                image: imageUrl
            });

            res.status(201).json({ success: true, message: "Kategori created", data: kategori });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },

    async update(req, res) {
        try {
            const checkKategori = await service.getOne(req.params.id);
            if (!checkKategori) {
                return res.status(404).json({ success: false, message: "Kategori not found" });
            }
            const data = {
                user_id: req.body.user_id,
                name: req.body.name,
                description: req.body.description,
                keywords: req.body.keywords
            };

            // HANYA set image jika upload baru
            if (req.file) {
                data.image = await processImage(req.file.buffer, "kategoris");
            }

            const kategori = await service.update(req.params.id, data);
            res.json({ success: true, message: "Kategori updated", data: kategori });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },

    async destroy(req, res) {
        const checkKategori = await service.getOne(req.params.id);
        if (!checkKategori) {
            return res.status(404).json({ success: false, message: "Kategori not found" });
        }
        try {
            res.json({ success: true, message: "Kategori deleted", data: await service.remove(req.params.id) });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }
}; 