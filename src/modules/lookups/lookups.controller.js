import { LookupsService } from "./lookups.service.js";

/*
 * Lookups Controller
 */
export const LookupsController = {

  /* Get Payment Types */
  async paymentType(req, res, next) {
    try {
      const data = await LookupsService.paymentType();  
      res.json(data);
    } catch (err) {
      next(err);
    } 
  },
  
  /* Get Contract Types */
  async getContractType(req, res, next) {
    try {
      const data = await LookupsService.getContractType();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
  
  /* Get Hours Worked */
  async hoursWorked(req, res, next) {
    try {
      const data = await LookupsService.hoursWorked();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  /* Get Working Days */
  async workingDays(req, res, next) {
    try {
      const data = await LookupsService.workingDays();
      res.json(data);
    } catch (err) {
      next(err);
    } 
  },
  
  /* Get Cities */
  async getCities(req, res, next) {
    try {
      const data = await LookupsService.getCities();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  /* Get Towns by City ID */
  async getTowns(req, res, next) {
    try {
      const data = await LookupsService.getTowns(req.params.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
  
  /* Get Dashboard Counts */
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
