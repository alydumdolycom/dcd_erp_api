import { PermissionsService } from "./permissions.service.js";
export const PermissionsController = {

    async getAll(req, res, next)  { 
        try {   
            const permissions = await PermissionsService.getAllPermissions();
            return res.json(permissions);
        } catch (err) {
            next(err);
        }       
    },

    async getById(req, res, next) { 
        try {       
            const permission = await  PermissionsService.getPermissionById(req.params.id);
            if (!permission) {
                return  res.status(404).json({
                    message: "Nu a fost gasit", 
                    data: null,
                    success: false,
                    status: 404
                });
            }   
            return res.json(permission);
        } catch (err) {
            next(err);
        }   
    },

    async create(req, res, next) {  
            try {
            const permission = await PermissionsService.create(req.body);
            res.status(201).json(permission);
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
            const permission = await PermissionsService.updatePermission(req.params.id, req.body);
            return res.json(permission);
        }


            catch (err) {       
            next(err);
        }
    },
    
    async delete(req, res, next) { 
        try {   
            await PermissionsService.deletePermission(req.params.id);
            return res.json({ message: `Sters ${req.params.id}` });
        }   catch (err) {   
            next(err);
        }
    }   
};