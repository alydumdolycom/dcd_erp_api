import { PermissionsService } from "./permissions.service.js";

/* Permissions Controller */
export const PermissionsController = {

    /* Get all permissions */
    async getAll(req, res, next)  { 
        try {   
            const permissions = await PermissionsService.getAll();
            return res.json(permissions);
        } catch (err) {
            next(err);
        }       
    },

    /* Get permission by ID */
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

    /* Create new permission */
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

    /* Update permission by ID */
    async update(req, res, next) { 
        try {   
            const permission = await PermissionsService.updatePermission(req.params.id, req.body);
            return res.json(permission);
        } catch (err) {       
            next(err);
        }
    },
    
    /* Delete permission by ID */
    async delete(req, res, next) { 
        try {   
            await PermissionsService.deletePermission(req.params.id);
            return res.json({ message: `Sters ${req.params.id}` });
        } catch (err) {       
            next(err);
        }
    }   
};