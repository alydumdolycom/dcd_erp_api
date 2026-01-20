import { addError } from "../../utils/validators.js";
import { DepartmentsModel } from "./departments.model.js";

/*
  Service for managing departments.
*/
export const DepartmentsService = {

  /* Retrieve all departments with optional search and sorting */
  async getAll({ search, sortBy, sortOrder }) {
    // Simulated database call  
    const data = await DepartmentsModel.all();
    return data;
  },

  /* Retrieve a department by its ID */
  async getById(id) {
    const data = await DepartmentsModel.findById(id);
    return data;
  },

  /* Create a new department with validation */
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

  /* Update an existing department by ID */
  async update(id, departmentData) {
    const data = await DepartmentsModel.update(id, departmentData);
    return data;
  },
  
  /* Delete a department by ID */
  async delete(id) {
    const data = await DepartmentsModel.delete(id);
    return data;
  } 
}