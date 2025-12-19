import { LookupsService } from "./lookups.service.js";

export const LookupsController = {

  async employeeCompany(req, res, next) {
    try {
      const data = await LookupsService.getEmployeeCompany(req.user.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async editEmployeeMode(req, res, next) {
    try {
      const data = await LookupsService.editEmployee(req.params.id, req.body.mode);
      return res.status(200).json({
        success: true,
        message: "Informatiile au fost actualizate",
        data: data
      });
    } catch (err) {
      next(err);
    }
  },

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
