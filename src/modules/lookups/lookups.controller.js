import { LookupsService } from "./lookups.service.js";

export const LookupsController = {
  async getDepartments(req, res, next) {
    try {
      const data = await LookupsService.getDepartments();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async getCities(req, res, next) {
    try {
      const data = await LookupsService.getCities();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async getTowns(req, res, next) {
    try {
      const data = await LookupsService.getTowns(req.params.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
  async getJobTypes(req, res, next) {
    try {
      const data = await LookupsService.getJobTypes();
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
};
