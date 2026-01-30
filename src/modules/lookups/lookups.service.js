import { LookupsModel } from "./lookups.model.js";

/*  Lookups Service */
export const LookupsService = {

  /*  Payment Type  */
  async paymentType(){
    return await LookupsModel.paymentType();
  },
  
  /*  Contract Type  */
  async getContractType(){
    return await LookupsModel.getContractType();
  },
  
  /*  Working Days  */
  async workingDays(){ 
    return await LookupsModel.workingDays();
  },
  
  /*  Hours Worked  */
  async hoursWorked(){
    return await LookupsModel.hoursWorked();
  },

  /*  Save Job Types  */
  async saveJobTypes(jobTypesData) {
    return await LookupsModel.saveJobTypes(jobTypesData);
  },

  /*  Get Cities  */
  async getCities() {
    return await LookupsModel.getCities();
  },

  /*  Get Towns by City ID  */
  async getTowns(id) {
    return await LookupsModel.getTowns(id);
  },

  /*  Get Job Types  */
  async getJobTypes() {
    return await LookupsModel.getJobTypes();
  },

  /*  Count Employees by Company ID  */
  async countEmployees(companyId) {
    return await LookupsModel.countEmployees(companyId);
  },

  /*  Count Users and Roles  */
  async countUsers() {
    return await LookupsModel.countUsers();
  },
  
  /*  Count Roles  */
  async countRoles() {
    return await LookupsModel.countRoles();
  },

  async getNomConstants() {
    return await LookupsModel.getNomConstants();
  }
};
