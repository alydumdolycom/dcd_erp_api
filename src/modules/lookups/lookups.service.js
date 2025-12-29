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
  }
};
