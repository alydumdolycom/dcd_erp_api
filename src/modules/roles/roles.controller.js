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
                    message: "Informatiile nu au fost gasite",
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
            const existingRole = await RolesService.getRoleById(req.params.id);
            if (!existingRole) {
            return res.status(404).json({
                message: "Informatiile nu au fost gasite",
                data: null,
                success: false,
                status: 404
            });
            }
            const role = await RolesService.updateRole(req.params.id, req.body);
            return res.json(role);
        } catch (err) {
            next(err);
        }
    },
    
    async delete(req, res, next) { 
        try {
            const findRole = await RolesService.getRoleById(req.params.id);
            if (!findRole) {
                return res.status(404).json({
                    message: "Informatiile nu au fost gasite",
                    data: null,
                    success: false,
                    status: 404
                });
            }
            const used = await RolesService.deleteRole(req.params.id);
            if(used === true) {
                return res.status(400).json({
                    message: "Rolul nu poate fi sters deoarece este utilizat.",
                    data: null,
                    success: false,
                    status: 400
                });
            }
            return res.json({ message: "Informatiile au fost sterse cu succes" });
        } catch (err) {
            next(err);
        }
    }   
};