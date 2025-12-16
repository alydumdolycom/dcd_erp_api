import { EmployeesModel } from "./employees.model.js";

export const EmployeesService = {
  async getAllPaginated({page,
    limit,
    search,
    sortBy,
    sortOrder,
    filters}) {
 // Business rules can live here
    if (limit > 100) {
      limit = 100; // hard limit protection
    }

    return EmployeesModel.all({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      filters
    });
  },
  async updateEmployee(id, payload) {
    const employee = await EmployeesModel.update(id, payload);

    if (!employee) {
      return null;
    }

    return employee;
  },
  async getById(id) {
    return EmployeesModel.findById(id);
  },
  async create(data) {
    return EmployeesModel.create(data);
  },
  async update(id, data) {
    return EmployeesModel.update(id, data);
  },
  async delete(id) {
    return EmployeesModel.delete(id);
  }
};
