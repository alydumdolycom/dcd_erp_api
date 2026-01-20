import { DepartmentsService } from "./departments.service.js";

/*
Controller pentru gestionarea departamentelor
*/
export const DepartmentsController = {

  /* Obtine toate departamentele cu optiuni de cautare si sortare */
  async getAll(req, res, next) {
    try {   
        const { 
            search = "",
            sortBy = res.query?.defaultSortBy || "id",
            sortOrder =  res.sortOrder || "asc",
        } = req.query;
        const rows = await DepartmentsService.getAll({
            search,
            sortBy,
            sortOrder,
        });
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (err) {
      next(err);
    }
  },

  /* Obtine un departament dupa ID */
  async getById(req, res, next) {
    try {
        const { id } = req.params;
        const data = await DepartmentsService.getById(id);
        if (!data) {
            return res.status(404).json({ success: false, message: "Informatiile nu au fost gasite" });
        }
        res.status(200).json({ success: true, data: data });
    } catch (err) {
      next(err);
    }
  },

  /* Creeaza un nou departament */
  async create(req, res, next) {
    try {   
        const { nume_departament, observatii } = req.body;
        const data = await DepartmentsService.create({ nume_departament, observatii });
        if (data.success === false) {
          return res.status(400).json(data);
        }
        res.status(201).json({ success: true, data: data });
    } catch (err) { 
      next(err);
    } 
  },

  /* Actualizeaza un departament existent */
  async update(req, res, next) {
    try { 
        const { id } = req.params;
        const { nume_departament, observatii } = req.body;
        const data = await DepartmentsService.getById(id);
        if (!data) {
            return res.status(404).json({ success: false, message: "Informatiile nu au fost gasite" });
        }
        const updatedDepartment = await DepartmentsService.update(id, { nume_departament, observatii }); 
        if (!updatedDepartment) {
            return res.status(404).json({ success: false, message: "Informatii nu au fost gasite" });
        }
        res.status(200).json({ success: true, data: updatedDepartment });
    } catch (err) { 
      next(err);
    }
  },
  
  /* Sterge un departament dupa ID */
  async delete(req, res, next) {
    try { 
        const { id } = req.params;
        const data = await DepartmentsService.getById(id);
        if (!data) {
            return res.status(404).json({ success: false, message: "Informatiile nu au fost gasite" });
        }
        const deleted = await DepartmentsService.delete(id);  
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Informatiile nu au fost gasite" });
        } 
        res.status(200).json({ success: true, message: "Informatiile au fost sterse cu succes" });
    } catch (err) {
      next(err);
    }
  }
};