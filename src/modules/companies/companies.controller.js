import { CompaniesService } from './companies.service.js';

export const CompaniesController = {
  async getAll(req, res, next) {
    try {
      const { search, sortBy, filters } = req.query;
      const companies = await CompaniesService.getAll({
        search,
        sortBy,
        filters
      });

    res.send(companies);
    } catch (err) {
      next({
        status: 500,
        message: "A aparut o eroare la preluarea informatiilor",
        details: err.message
      });
    }
  },

  async getBy(req, res, next) {    
    try {
      const find = await CompaniesService.getById(req.params.id);
      if (!find) {
        return  res.status(404).json({
          success: false,
          message: "Informatiile nu au fost gasite"
        });
      }
      // Logic to retrieve a company by ID
      const company = await CompaniesService.getById(req.params.id);
      res.send(company);
    } catch (err) {
      next({
        status: 500,
        message: "A aparut o eroare la preluarea informatiilor",
        details: err.message
      });
    }
  },

  async create(req, res, next) {
    try {
      const employee = await CompaniesService.create(req.body);
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

  async update (req, res) {
    const { id } = req.params;  
    const data = req.body;
    try {
      const find = await CompaniesService.getById(id);
      if (!find) {
        return  res.status(404).json({
          success: false,
          message: "Informatiile nu au fost gasite"
        });
      }
      const row = await CompaniesService.update(id, data);
      res.status(200).json({
        success: true,
        message: "Informatiile au fost actualizate",
        data: row
      }); 
    }
    catch (err) {
      res.status(500).json({
        success: false,
        message: "A aparut o eroare la actualizarea informatiilor",
        details: err.message
      });
    }
  },

  async delete(req, res, next) {
    // Logic to delete a company
    try {
      const find = await CompaniesService.getById(req.params.id);
      if (!find) {
        return  res.status(404).json({
          success: false,
          message: "Informatiile nu au fost gasite"
        });
      }
      const result = await CompaniesService.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      next({
        status: 500,
        message: "A aparut o eroare la stergerea informatiilor",
        details: err.message
      });
    }
  } 
};  