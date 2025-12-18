import { RolesService } from "./roles.service.js";
export const RolesController = {
    async getAll(req, res, next)  { 
        try {
            const roles = await RolesService.getAllRoles();
            return res.json(roles);
        } catch (err) {
            next(err);
        }
    },
    async getById(req, res, next) { 
        try {
            const role = await  RolesService.getRoleById(req.params.id);    
            if (!role) {
                return  res.status(404).json({
                    message: "Nu a fost gasit",
                    data: null,
                    success: false,
                    status: 404
                });
            }
            return res.json(role);
        } catch (err) {
            next(err);
        }   
    },

    async create(req, res, next) { 
          try {
            const role = await RolesService.create(req.body);
            res.status(201).json(role);
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
            const role = await RolesService.updateRole(req.params.id, req.body);
            return res.json(role);
        } catch (err) {
            next(err);
        }
    },
    async delete(req, res, next) { 
        try {
            await RolesService.deleteRole(req.params.id);
            return res.json({ message: `Sters ${req.params.id}` });
        } catch (err) {
            next(err);
        }
    }   
};