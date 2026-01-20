import { EmployeesModel } from "./employees.model.js";
import { addError } from "../../utils/validators.js";

/* Service for managing employees */
export const EmployeesService = {

  /* Get all employees with optional filters and sorting */
  async getAll({ 
          search,
          sortBy,
          id_firma,
          sortOrder,
          data_angajarii,
          filters: {
            id_departament,
            id_functie,
            luna_angajarii,
            anul_angajarii,
            sex,
            activ
          }}) {

    const data = await EmployeesModel.all({ 
      search,
      sortBy,
      id_firma,
      sortOrder,
      data_angajarii,
      filters: {
        id_departament,
        id_functie,
        luna_angajarii,
        anul_angajarii,
        sex,
        activ
      }});
    return { data };
  },

  /* Get company details for a specific employee */
  async getEmployeeCompany(id){ 
    return await EmployeesModel.getEmployeeCompany(id);
  },

  /* Update employee details with provided data */
  async update(id, data) {
    // Patch method: update only provided fields
    const row = await EmployeesModel.find(id);
    if (!row) {
      return null;
    }
    const updatedRow = await EmployeesModel.update(id, data);
    return updatedRow;
  },

  /* Find an employee by ID */
  async findById(id) {
    const data = await EmployeesModel.findById(id);
    if (!data) {
      return null;
    }
    return data;
  },

  /* Create a new employee with validation */
  async create(data) {
    const errors = {};

    // REQUIRED
    if (!data.cnp) addError(errors, "cnp", "obligatoriu");
    if (!data.nume) addError(errors, "nume", "obligatoriu");
    if (!data.prenume) addError(errors, "prenume", "obligatoriu");
    if (!data.salar_baza) addError(errors, "salar_baza", "obligatoriu");
    if (!data.salar_net) addError(errors, "salar_net", "obligatoriu");
    if (!data.data_angajarii) addError(errors, "data_angajarii", "obligatoriu");
    if (data.data_angajarii && data.data_incetarii && data.data_angajarii > data.data_incetarii) {
      addError(errors, "data_incetarii", "Data incetarii trebuie sa fie dupa data angajarii");
    }
    // FORMAT
    if (data.cnp && data.cnp.length !== 13) {
      addError(errors, "cnp", "Trebuie sa aiba 13 caractere");
    }

    if (data.salar_net && isNaN(Number(data.salar_net))) {
      addError(errors, "salar_net", "Trebuie sa fie un numar");
    }

    if (data.salar_baza && isNaN(Number(data.salar_baza))) {
      addError(errors, "salar_baza", "Trebuie sa fie un numar");
    }

    // DATABASE UNIQUE CHECK
    if (data.cnp) {
      const existing = await EmployeesModel.findByCnp(data.cnp);
      if (existing) {
        addError(errors, "cnp", "CNP deja exista");
      }
    }

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }
    return EmployeesModel.create(data);
  },

  /* Update employee details */
  async update(id, data) {
    return EmployeesModel.update(id, data);
  },

  /* Delete an employee by ID */
  async delete(id) {
    return EmployeesModel.delete(id);
  },

  /* Modify and edit employee details */
  async modEditEmployee(employeeData) {
    return await EmployeesModel.modEditEmployee(employeeData);
  }
};
