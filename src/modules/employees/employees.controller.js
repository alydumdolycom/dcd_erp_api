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
    next({  
      status: 200,
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
  },

  async updateEmployeesList(req, res, next) {
    try {
      const { id_firma } = req.query;
      const id = req.params.id;
      const result = await EmployeesService.updateEmployeesList(id, req.body);
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
  },

  async calculateBrutToNetSalary(req, res, next) {
    const { brut, persoaneIntretinere, data } = req.body;
    // datele din nomenclatoare.nom_taxe_cote
    // cota_cas (1), cota_cass (2), cota_impozit (3)
    // pasii pentru calcul:
    /*
      brut = salariul brut
      cota_cas = procent din nomenclatoare.nom_taxe_cote pentru id_taxa=1
      cota_cass = procent din nomenclatoare.nom_taxe_cote pentru id_taxa=2
      cota_impozit = procent din nomenclatoare.nom_taxe_cote pentru id_taxa=3
      */
    const [dayStr, monthStr, yearStr] = req.body.data.split("-");
    const month = parseInt(monthStr, 10); // 1
    const year = parseInt(yearStr, 10);   // 2026
    const checkDate = await EmployeesService.getPayRol(month,year);
    if(!checkDate) {
      return res.status(400).json({
        success: false,
        message: "Nu exista stat de plata pentru luna si anul selectat"
      });
    }
    // // 1. Get employee salary data
    const taxe = await EmployeesService.getNomenclatoareData();

    const cota_cas = taxe[0].procent;
    const cota_cass = taxe[1].procent;
    const cota_impozit = taxe[2].procent;
    const persoane = persoaneIntretinere ?? 0;

    const cas = Math.round((brut*cota_cas)/100);    // calcul fara zecimale
    const cass = Math.round((brut*cota_cass)/100);    // calcul fara zecimale
    const flag = "brut";
    const suma = brut;
    const result = await EmployeesService.deducere(flag, suma, persoane, data);
    const bazaImpozitare = brut - cas - cass - result;
    const impozit = Math.round((bazaImpozitare * cota_impozit)/100);
    // // const net = parseInt(brut-cas-cass-impozit);

    res.status(200).json({
      success: true,
      data: {
        net: result
      }
    });
  },

  async calculateNetToBrutSalary(req, res, next) {
    const { net, persoaneIntretinere = 0, data } = req.body;

    if (!net || isNaN(net) || net <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valoare net invalidă"
      });
    }

    // Parse data (format DD-MM-YYYY)
    const [dayStr, monthStr, yearStr] = data.split("-");
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    // Verifică existența statului de plată (luna și anul)
    const checkDate = await EmployeesService.getPayRol(month, year);
    if (!checkDate) {
      return res.status(400).json({
        success: false,
        message: "Nu există stat de plată pentru luna și anul selectat"
      });
    }
     const taxe = await EmployeesService.getNomenclatoareData();

    const cota_cas = taxe[0].procent;
    const cota_cass = taxe[1].procent;
    const cota_impozit = taxe[2].procent;

    const cas = Math.round((net*cota_cas)/100);    // calcul fara zecimale
    const cass = Math.round((net*cota_cass)/100);    // calcul fara zecimale
    const flag = "net";
    const persoane = persoaneIntretinere ?? 0;
    const suma = net;
    const result = await EmployeesService.deducere(flag, suma, persoane, data);

    res.status(200).json({
      success: true,
      data: {
        brut: result
      }
    });
  },

  async getEmployeePaymentMethods(req, res, next) { 
    try {
      const { id_salariat } = req.params; 
      const result = await EmployeesService.getEmployeePaymentMethods(id_salariat);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (err) {
      next({
        status: 500,
        message: "A aparut o eroare la incarcarea metodelor de plata",
        details: err.message
      });
    } 
  },

  async employeeFiles(req, res, next) {
    try { 
      const findEmployee = await EmployeesService.findById(req.query.id_salariat);
      if (!findEmployee) {
        return res.status(404).json({
          success: false,
          message: "Salariatul nu a fost gasit"
        });
      }
      const result = await EmployeesService.getEmployeeFiles(req.query.id_salariat);
      res.status(200).json({
          success: true,
          data: result
        });
    } catch(err) {
      next({
        status: 500,
        message: "A aparut o eroare la incarcarea fisierelor angajatului",
        details: err.message
      });
    }
  }
};
