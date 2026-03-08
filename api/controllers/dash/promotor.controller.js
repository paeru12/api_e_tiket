const service = require("../../services/dash/promotor.service");
const processImage = require("../../utils/imageProcessor");

module.exports = {

    async getPagination(req, res) {
        try {

            const creatorId = req.user.creator_id;
            const { page = 1, limit = 10, search = "" } = req.query;
            const data = await service.getPagination(creatorId, page, limit, search);
            res.json({
                success: true,
                message: "Promotor users retrieved with pagination",
                data
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    async getAll(req, res) {
        try {
            const creatorId = req.user.creator_id;

            const data = await service.getAll(creatorId);
            res.json({
                success: true,
                message: "Promotor users retrieved",
                data
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    async getOne(req, res) {
        try {
            const creatorId = req.user.creator_id;

            const data = await service.getOne(req.params.id, creatorId);
            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: "Promotor user not found"
                });
            }
            res.json({
                success: true,
                message: "Promotor user retrieved",
                data
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    async getScanStaff(req, res) {
        try {
            const creatorId = req.user.creator_id;

            const data = await service.getScanStaff(creatorId);
            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: "Promotor scan staff not found"
                });
            }
            res.json({
                success: true,
                message: "Promotor scan staff retrieved",
                data
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    async registerPromotor(req, res) {
        try {
            const result = await service.registerPromotor(req.body);

            res.status(201).json({
                success: true,
                message: "Promotor Owner registered successfully",
                data: result
            });
        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message
            });
        }
    },

    async createPromotorEventAdmin(req, res) {
        try {
            const creatorId = req.user.creator_id;

            const result = await service.createPromotorEventAdmin(
                req.body,
                creatorId
            );

            res.status(201).json({
                success: true,
                message: "Promotor Event Admin created successfully",
                data: result
            });
        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message
            });
        }
    },

    async createScanStaff(req, res) {
        try {
            const creatorId = req.user.creator_id;

            const result = await service.createScanStaff(
                req.body,
                creatorId
            );

            res.status(201).json({
                success: true,
                message: "Promotor Scan Staff created successfully",
                data: result
            });
        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message
            });
        }
    },

    async updatePromotorMember(req, res) {
        try {
            const data = { ...req.body };

            if (req.file) {
                data.image = await processImage(
                    req.file.buffer,
                    "image"
                );
            }

            const creatorId = req.user.creator_id;

            const result = await service.updatePromotorMember(
                req.params.id,
                data,
                creatorId
            );

            res.json({
                success: true,
                message: "Promotor member updated successfully",
                data: result
            });

        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message
            });
        }
    },

    async updatePromotorPassword(req, res) {
        try {
            const creatorId = req.user.creator_id;
            const result = await service.updatePromotorPassword(req.params.id, req.body, creatorId);
            res.json({
                success: true,
                message: "Promotor password updated successfully",
                data: result
            });
        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message
            });
        }
    },

    async removePromotorMember(req, res) {
        try {
            const creatorId = req.user.creator_id;
            await service.remove(req.params.id, creatorId);
            res.json({
                success: true,
                message: "Promotor member removed successfully"
            });
        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message
            });
        }
    }
};