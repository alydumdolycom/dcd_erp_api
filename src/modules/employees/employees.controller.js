import { EmployeesService } from "./employees.service.js";
export const EmployeesController = {
  async getAll(req, res, next) {
    try {
      const {
        page = 1,
        limit = res.limits?.default || 10,
        search = "",
        sortBy = res.query?.defaultSortBy || "id",
        sortOrder =  res.sortOrder || "asc",

        // filters
        id_departament,
        id_functie,
        sex,
        activ
      } = req.query;

      const result = await EmployeesService.getAllPaginated({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        filters: {
          id_departament,
          id_functie,
          sex,
          activ
        }
      });

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const employee = await EmployeesService.getById(req.params.id);
      if (!employee) {
        return res.status(404).json({ message: "Salariatul nu a fost gasit" });
      }
      res.json(employee);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {

    try {
      const employee = await EmployeesService.create(req.body);
      res.status(201).json(employee);
    } catch (err) {
      next(err);
    }
  },
  async update(req, res) {
    const { id } = req.params;

    const employee = await EmployeesService.updateEmployee(
      Number(id),
      req.body
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee
    });
  },
  async delete(req, res) {
    const { id } = req.params;
    const deleted = await EmployeesService.deleteEmployee(Number(id));
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }
    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully"
    });
  }
};
