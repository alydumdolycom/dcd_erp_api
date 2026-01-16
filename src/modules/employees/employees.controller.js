import { EmployeesService } from "./employees.service.js";

export const EmployeesController = {
    async getAll(req, res, next) {
      try {
        const {
          search = "",
          sortBy = res.query?.defaultSortBy || "id",
          id_firma,
          sortOrder =  res.sortOrder || "asc",
          data_angajarii,
          // filters
          id_departament,
          id_functie,
          luna_angajarii,
          anul_angajarii,
          sex,
          activ
        } = req.query;

        const result = await EmployeesService.getAll({
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
          }
        });

        res.status(200).json({
          success: true,
          data: result.data
        });
      } catch (err) {
        next({
          status: 500,
          message: "A aparut o eroare la incarcarea listei de salariati",
          details: err.message
        });
      }
    },

    async getById(req, res, next) {
      try {
        const employee = await EmployeesService.findById(req.params.id);
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
        res.status(201).json({
          success: true,
          message: "Informatiile au fost salvate",
          data: employee
        });
      } catch (err) {
        next({
          status: 500,
          message: "A aparut o eroare la salvarea informatiilor",
          details: err.message
        });
      }
    },

    async update(req, res, next) {
      try {
        const { id } = req.params;
        const data = await EmployeesService.update(id, req.body);
        
        return res.status(200).json({
          success: true,
          data: data
        });
      } catch (err) {
        next({
          status: 500,  
          message: "Eroare la server",
          details: err.message
        });
      }
    },
  
    async delete(req, res, next) {
      const { id } = req.params;
      const deleted = await EmployeesService.delete(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Nu a fost gasit"
        });
      }
      return res.status(200).json({
        success: true,
        message: "Informatiile au fost sterse"
      });
    },
    
    async employeeCompany(req, res, next) {
      try {
        const data = await EmployeesService.getEmployeeCompany(req.user.id);
        res.json(data);
      } catch (err) {
        next(err);
      }
    }
};
