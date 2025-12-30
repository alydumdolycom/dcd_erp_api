import { LookupsModel } from "./lookups.model.js";

export const LookupsService = {

  async getContractType(){
    return await LookupsModel.getContractType();
  },

  async saveJobTypes(jobTypesData) {
    return await LookupsModel.saveJobTypes(jobTypesData);
  },

  async getCities() {
    return await LookupsModel.getCities();
  },

  async getTowns(id) {
    return await LookupsModel.getTowns(id);
  },

  async getJobTypes() {
    return await LookupsModel.getJobTypes();
  },
  async countEmployees(companyId) {
    return await LookupsModel.countEmployees(companyId);
  },
  async countUsers() {
    return await LookupsModel.countUsers();
  },
  async countRoles() {
    return await LookupsModel.countRoles();
  }
};
