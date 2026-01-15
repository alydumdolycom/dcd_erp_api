import { addError } from "../../utils/validators.js";
import { DepartmentsModel } from "./departments.model.js";

export const DepartmentsService = {

  async getAll({ search, sortBy, sortOrder }) {
    // Simulated database call  
    const data = await DepartmentsModel.all();
    return data;
  },

  async getById(id) {
    const data = await DepartmentsModel.findById(id);
    return data;
  },

  async create(departmentData) {
    const errors = {};
  
    // Validate required fields
    if (!departmentData.nume_departament) addError(errors, "nume_departament", "Numele departamentului este obligatoriu");

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }
    // Check if nume_departament already exists
    const existing = await DepartmentsModel.findOne({ nume_departament: departmentData.nume_departament });
    if (existing) {
      return { success: false, errors: { nume_departament: "Departamentul deja exista" } };
    }
    const data = await DepartmentsModel.create(departmentData);
    return data;
  },

  async update(id, departmentData) {
    const data = await DepartmentsModel.update(id, departmentData);
    return data;
  },
  
  async delete(id) {
    const data = await DepartmentsModel.delete(id);
    return data;
  } 
}