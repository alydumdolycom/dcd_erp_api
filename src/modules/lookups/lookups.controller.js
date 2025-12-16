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
      const { county_id } = req.query;
      const data = await LookupsService.getCities(county_id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async getTowns(req, res, next) {
    try {
      const { city_id } = req.query;
      const data = await LookupsService.getTowns(city_id);
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
