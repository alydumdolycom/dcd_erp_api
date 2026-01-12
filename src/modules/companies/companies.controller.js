import { CompaniesService } from './companies.service.js';

export const CompaniesController = {
  async getAll(req, res, next) {
    try {
      const { page, limit, search, sortBy, sortOrder, filters } = req.query;
      const companies = await CompaniesService.getAllPaginated({
        page: Number(page) || 1,
        limit: Number(limit) || 10,   
        search: search || '',
        sortBy: sortBy || 'name',
        sortOrder: sortOrder || 'asc',
        filters: filters ? JSON.parse(filters) : {}
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
    const { id } = req.params;
    try {
      // Logic to retrieve a company by ID
      const company = await CompaniesService.getById(id);
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
  update: (req, res) => {
    const { id } = req.params;  
    const companyData = req.body;
    // Logic to update an existing company
    res.send(`Update company with ID: ${id}`);
  },
  delete: (req, res) => {
    const { id } = req.params;  
    // Logic to delete a company
    res.send(`Delete company with ID: ${id}`);
  } 
};  