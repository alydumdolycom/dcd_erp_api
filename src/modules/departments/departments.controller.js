import { DepartmentsService } from "./departments.service.js";

export const DepartmentsController = {
  async getAll(req, res, next) {
    try {   
        const { 
            search = "",
            sortBy = res.query?.defaultSortBy || "id",
            sortOrder =  res.sortOrder || "asc",
        } = req.query;
        const result = await DepartmentsService.getAll({
            search,
            sortBy,
            sortOrder,
        });
        res.status(200).json({
            success: true,
            data: result.data
        });
    } catch (err) {
      next(err);
    }
  },
  async getById(req, res, next) {
    try {
        const { id } = req.params;
        const department = await DepartmentsService.getById(id);
        if (!department) {
            return res.status(404).json({ success: false, message: "Department not found" });
        }
        res.status(200).json({ success: true, data: department });
    } catch (err) {
      next(err);
    }
  },
  async create(req, res, next) {
    try {   
        const { name, companyId } = req.body;
        const newDepartment = await DepartmentsService.create({ name, companyId });
        res.status(201).json({ success: true, data: newDepartment });
    } catch (err) { 
      next(err);
    } 
  },
  async update(req, res, next) {
    try { 
        const { id } = req.params;
        const { name, companyId } = req.body;
        const updatedDepartment = await DepartmentsService.update(id, { name, companyId }); 
        if (!updatedDepartment) {
            return res.status(404).json({ success: false, message: "Department not found" });
        }
        res.status(200).json({ success: true, data: updatedDepartment });
    } catch (err) { 
      next(err);
    }
  },
  async delete(req, res, next) {
    try { 
        const { id } = req.params;
        const deleted = await DepartmentsService.delete(id);  
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Department not found" });
        } 
        res.status(200).json({ success: true, message: "Department deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
};