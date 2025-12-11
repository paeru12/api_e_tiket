const service = require("../services/user.service");

module.exports = {
  async getAll(req, res, next) {
    try {
      res.json(await service.getAll());
    } catch (err) {
      next(err);
    }
  },

  async getOne(req, res, next) {
    try {
      res.json(await service.getOne(req.params.id));
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      res.status(201).json(await service.create(req.body));
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      res.json(await service.update(req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      res.json(await service.remove(req.params.id));
    } catch (err) {
      next(err);
    }
  },

  async assignRole(req, res, next) {
    try {
      res.json(await service.assignRole(req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  }
};
