import { LookupsModel } from "./lookups.model.js";

export const LookupsService = {

  async getContractType(){
    return await LookupsModel.getContractType();
  },

  async getEmployeeCompany(id){ 
    return await LookupsModel.getEmployeeCompany(id);
  },

  async editEmployee(id, mode) {
    return await LookupsModel.updateEmployeeMode(id, mode);
  },

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
