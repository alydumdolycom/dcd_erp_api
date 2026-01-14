import { DepartmentsModel } from "./departments.model.js";

export const DepartmentsService = {

  async getAll({ search, sortBy, sortOrder }) {
    // Simulated database call  
   const departments = await DepartmentsModel.all();
    return {    
        data: departments
    };
  },

  async getById(id) {
    const department = await DepartmentsModel.findById(id);
    return department;
  },

  async create(departmentData) {
    const newDepartment = await DepartmentsModel.create(departmentData);
    return newDepartment;
  },

  async update(id, departmentData) {
    const updatedDepartment = await DepartmentsModel.update(id, departmentData);
    return updatedDepartment;
  },
  
  async delete(id) {
    const deleted = await DepartmentsModel.delete(id);
    return deleted;
  } 
}