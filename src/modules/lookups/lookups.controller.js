import { LookupsService } from "./lookups.service.js";

export const LookupsController = {

  async paymentType(req, res, next) {
    try {
      const data = await LookupsService.paymentType();  
      res.json(data);
    } catch (err) {
      next(err);
    } 
  },
  
  async getContractType(req, res, next) {
    try {
      const data = await LookupsService.getContractType();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
  
  async hoursWorked(req, res, next) {
    try {
      const data = await LookupsService.hoursWorked();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async monthsOfYear(req, res, next) {
    try {
      const data = await LookupsService.monthsOfYear();
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
  
  async dashboardCount(req, res, next) {
    const companyId = req.params.id;
    try {
      const countEmployees = await LookupsService.countEmployees(companyId);
      const countUsers = await LookupsService.countUsers();
      const countRoles = await LookupsService.countRoles();
      res.json({
        countEmployees: countEmployees,
        countUsers: countUsers,
        countRoles: countRoles,
      });
    } catch (err) {
      next(err);
    }
  }
};
