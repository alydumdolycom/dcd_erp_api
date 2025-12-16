import { LookupsModel } from "./lookups.model.js";

export const LookupsService = {
  getDepartments() {
    return LookupsModel.getDepartments();
  },

  getCities(countyId) {
    return LookupsModel.getCities(countyId);
  },

  getTowns(cityId) {
    return LookupsModel.getTowns(cityId);
  },

  getJobTypes() {
    return LookupsModel.getJobTypes();
  }
};
