import { EmployeesModel } from "./employees.model.js";

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
    return EmployeesModel.create(data);
  },

  /* Update employee details */
  async update(id, data) {
    return await EmployeesModel.update(id, data);
  },

  /* Delete an employee by ID */
  async delete(id) {
    return await EmployeesModel.delete(id);
  },

  /* Modify and edit employee details */
  async modEditEmployee(employeeData) {
    return await EmployeesModel.modEditEmployee(employeeData);
  },

  async getEmployeeFeatures() {
    return await EmployeesModel.getEmployeeFeatures();
  },

  async getEmployeesList(id_firma) {
    const data =  await EmployeesModel.getEmployeesList(id_firma);
    return data;
  },

  async findByCnp(cnp) {
    const data = await EmployeesModel.findByCnp(cnp); 
    return data;
  }
};
