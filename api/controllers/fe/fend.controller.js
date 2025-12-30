const service = require("../../services/fe/fend.service");

module.exports = {
    async kategoriAll(req, res) {
        res.json({ success: true, message: "Kategori retrieved", data: await service.kategoriAll() });
    },

    async getEventByKategoriSlug(req, res) {
        res.json({ success: true, message: "Event retrieved", data: await service.getEventByKategoriSlug(req.params.slug) });
    },

    async regionAll(req, res) {
        res.json({ success: true, message: "Region retrieved", data: await service.regionAll() });
    },

    async getEventByRegionSlug(req, res) {
        res.json({ success: true, message: "Event retrieved", data: await service.getEventByRegionSlug(req.params.slug) });
    },

    async eventAll(req, res) {
        res.json({ success: true, message: "Event retrieved", data: await service.eventAll() });
    },

    async getOneEvent(req, res) {
        res.json({ success: true, message: "Event retrieved", data: await service.getOneEvent(req.params.slug) });
    },

    async getTicketEvent(req, res) {
        res.json({ success: true, message: "Ticket retrieved", data: await service.getTicketEvent(req.params.slug) });
    }

    // async bannerAll(req, res) {
    //     res.json({ success: true, message: "Banner retrieved", data: await service.bannerAll() });
    // }


}; 