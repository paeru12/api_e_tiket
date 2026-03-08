const service = require("../../services/dash/region.service");
module.exports = {
    async province(req, res) {
        res.json({ success: true, message: "Province retrieved", data: await service.province() });
    },

    async district(req, res) {
        res.json({ success: true, message: "District retrieved", data: await service.district(req.params.provinceId) });
    }
};