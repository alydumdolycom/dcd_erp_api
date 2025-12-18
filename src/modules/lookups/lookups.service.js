import { LookupsModel } from "./lookups.model.js";

export const LookupsService = {
  async getDepartments() {
    return await LookupsModel.getDepartments();
  },

  async getCities() {
    return await LookupsModel.getCities();
  },

  async getTowns(id) {
    return await LookupsModel.getTowns(id);
  },

  async getJobTypes() {
    return await LookupsModel.getJobTypes();
  }
};
