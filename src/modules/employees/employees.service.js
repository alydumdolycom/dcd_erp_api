import { EmployeesModel } from "./employees.model.js";
import { addError } from "../../utils/validators.js";
export const EmployeesService = {

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

  async getEmployeeCompany(id){ 
    return await EmployeesModel.getEmployeeCompany(id);
  },

  async editEmployee(id, mode) {
    return await EmployeesModel.updateEmployeeMode(id, mode);
  },

  async updateEmployee(id, payload) {
    let paymentMethod = {};
    
    paymentMethod.cont_bancar = payload.cont_bancar;
    paymentMethod.id_modplata = payload.id_modplata;
    paymentMethod.activ = payload.activ;
    delete payload.cont_bancar;
    delete payload.id_modplata;
    delete payload.activ;  
    const employeeData = { ...payload };
    const employee = await EmployeesModel.update(id, payload, paymentMethod);

    if (!employee) {
      return null;
    }

    return employee;
  },

  async findById(id) {
    return EmployeesModel.findById(id);
  },

  async create(data) {
    const errors = {};

    // REQUIRED
    if (!data.cnp) addError(errors, "cnp", "obligatoriu");
    if (!data.nume) addError(errors, "nume", "obligatoriu");
    if (!data.prenume) addError(errors, "prenume", "obligatoriu");
    if (!data.salar_baza) addError(errors, "prenume", "obligatoriu");
    if (!data.salar_net) addError(errors, "prenume", "obligatoriu");
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
      return { errors };
    }
    return EmployeesModel.create(data);
  },

  async update(id, data) {
    return EmployeesModel.update(id, data);
  },

  async delete(id) {
    return EmployeesModel.delete(id);
  },

  async modEditEmployee(employeeData) {
    return await EmployeesModel.modEditEmployee(employeeData);
  }
};
