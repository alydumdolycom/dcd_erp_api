import { EmployeesService } from "./employees.service.js";
/*
  Controller for managing employees.
*/
export const EmployeesController = {
  
  /* Retrieve all employees with optional search, sorting, and filtering */
  async getAll(req, res, next) {
      try {
        const {
          search = "",
          sortBy = req.query?.defaultSortBy || "id",
          id_firma,
          sortOrder =  req.query?.sortOrder || "asc",
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

  /* Retrieve a single employee by ID */
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
  
  /* Create a new employee */
  async create(req, res, next) {
    
    if (!req.body.cnp) {
      return res.status(400).json({
        success: false,
        message: "CNP-ul este obligatoriu"
      });
    }

    if (req.body.cnp.length !== 13 || req.body.cnp.length > 13) {
      return res.status(400).json({
        success: false,
        message: "CNP-ul trebuie să aibă exact 13 caractere"
      });
    }

    if (!req.body.cnp || !/^\d{13}$/.test(req.body.cnp)) {
      return res.status(400).json({
        success: false,
        message: "CNP-ul trebuie să conțină numai cifre"
      });
    }
    
    if(!req.body.nume){
      return  res.status(400).json({
        success: false,
        message: "Numele este obligatoriu"
      });
    }

    if(req.body.nume){
      if (
        req.body.nume.trim() === "" ||
        req.body.nume.includes(" ") ||
        /\d/.test(req.body.nume)
      ) {
        return res.status(400).json({
          success: false,
          message: "Numele este obligatoriu si nu trebuie sa contina cifre"
        });
      }
    }

    if(req.body.prenume){
      if (
        req.body.prenume.trim() === "" ||
        req.body.prenume.includes(" ") ||
        /\d/.test(req.body.prenume)
      ) {
        return res.status(400).json({
          success: false,
          message: "Prenumele este obligatoriu si nu trebuie sa contina cifre"
        });
      }
    }

    if(!req.body.prenume){
      return res.status(400).json({
        success: false,
        message: "Prenumele este obligatoriu"
      });
    }
    if (req.body.data_angajarii && req.body.data_incetarii && req.body.data_angajarii > req.body.data_incetarii) {
      return res.status(400).json({
        success: false,
        message: "Data incetarii trebuie sa fie dupa data angajarii"
      });
    }

    if(req.body.id_departament === "" || req.body.id_departament === null || req.body.id_departament === undefined ) {
      return res.status(400).json({
        success: false,
        message: "Departamentul este obligatoriu"
      });
    }
    if (req.body.salar_net && isNaN(Number(req.body.salar_net))) {
      return res.status(400).json({
        success: false,
        message: "Trebuie sa fie un numar"
      });
    }

    if (req.body.salar_baza && isNaN(Number(req.body.salar_baza))) {
      return res.status(400).json({
        success: false,
        message: "Trebuie sa fie un numar"
      });
    }

    if (req.body.cnp) {
      const existing = await EmployeesService.findByCnp(req.body.cnp);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "CNP deja exista"
        });
      }
    }

    if(req.body.sex === "" || req.body.sex === null || req.body.sex === undefined) {
      return res.status(400).json({
        success: false,
        message: "Sexul este obligatoriu"
      });
    }

    if(req.body.prod_tesa === "" || req.body.prod_tesa === null || req.body.prod_tesa === undefined) {
      return res.status(400).json({
        success: false,
        message: "prod_tesa este obligatoriu"
      });
    }
    if(req.body.id_modplata == 2 && (!req.body.cont_bancar || req.body.cont_bancar.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "Contul bancar este obligatoriu"
      });
    }
    try {
      const data = await EmployeesService.create(req.body);
      if(data.success === false) {
        return res.status(400).json({
          success: false,
          errors: data.errors
        });
      }
      res.status(201).json({
        success: true,
        message: "Informatiile au fost salvate",
      });
    } catch (err) {
      next({
        status: 500,
        message: "A aparut o eroare la salvarea informatiilor",
        details: err.message
      });
    }
  },
  /* Update an existing employee */
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

  /* Delete an employee by ID */
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
  
  /* Get the company information of the logged-in employee */
  async employeeCompany(req, res, next) {
    try {
      const data = await EmployeesService.getEmployeeCompany(req.user.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async modEditEmployee(req, res, next) {
    try { 
      const employeeData = req.body;
      req.body.id_utilizator = req.user.id;
      const updatedEmployee = await EmployeesService.modEditEmployee(employeeData);
      res.status(200).json({
        success: true,
        message: "Informatiile au fost actualizate",
        data: updatedEmployee
      });
    } catch (err) {
      next({
        status: 500,
        message: "A aparut o eroare la actualizarea informatiilor",
        details: err.message
      });
    }
  },

    /* Retrieve all employees features */
  async getEmployeeFeatures(req, res, next) {
      try {
        const {
          search = "",
          sortBy = req.query?.defaultSortBy || "id",
          id_firma,
          sortOrder =  req.query?.sortOrder || "asc",
          data_angajarii,
          // filters
          id_departament,
          id_functie,
          luna_angajarii,
          anul_angajarii,
          sex,
          activ
        } = req.query;

        const result = await EmployeesService.getEmployeeFeatures({
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

  async getEmployeesList(req, res, next) {
    try {
      const { id_firma } = req.query; 
      const result = await EmployeesService.getEmployeesList(id_firma);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (err) {
      next({
        status: 500,
        message: "A aparut o eroare la incarcarea listei de salariati",
        details: err.message
      });
    }
  }
};
