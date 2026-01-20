import { PermissionModel } from "./permissions.model.js";

/* 
Permissions Service
Handles business logic related to permissions.
*/
export const PermissionsService = { 

    /* Get All Permissions */
    async getAll() { 
        const permissions = await PermissionModel.getAll(); 
        return permissions; 
    },
    
    /* Get All Permissions by Role IDs */
    async getAllPermissions(roleIds) { 
        const permissions = await PermissionModel.getByRoleIds(roleIds); 
        return permissions; 
    },

    /* Get User-Specific Permissions */
    async getUserPermissions(roleId) {
        // Logic to get user-specific permissions from the database
        const userPermissions = await PermissionModel.getRolePermissions(roleId); 
        return userPermissions; 
    },
    /* Create New Permission */
    async create(data) { 
        const newPermission = await PermissionModel.create(data); 
        return newPermission; 
    },

    /* Get Permission by ID */
    async getPermissionById(id) { 
        const permission = await PermissionModel.getById(id); 
        return permission; 
    },

    /* Update Permission */
    async updatePermission(id, data) { 
        const updatedPermission = await PermissionModel.update(id, data); 
        return updatedPermission; 
    },

    /* Delete Permission */
    async deletePermission(id) { 
        await PermissionModel.delete(id); 
        return; 
    }
};