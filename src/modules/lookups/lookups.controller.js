import { LookupsService } from "./lookups.service.js";

export const LookupsController = {

  async getContractTypes(req, res, next) {
    try {
      const data = await LookupsService.getContractType();
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
  async countEmployees(req, res, next) {
    const companyId = req.params.id;
    try {
      const data = await LookupsService.countEmployees(companyId);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
  async countUsers(req, res, next) {
    const companyId = req.params.id;

    try {
      const data = await LookupsService.countUsers(companyId);
      res.json(data);
    } catch (err) {
      next(err);
    } 
  }
};
