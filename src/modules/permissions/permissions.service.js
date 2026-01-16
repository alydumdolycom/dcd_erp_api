import { PermissionModel } from "./permissions.model.js";

export const PermissionsService = { 

    async getAll() { 
        // Logic to get all permissions from the database
        const permissions = await PermissionModel.getAll(); 
        return permissions; 
    },
    
    async getAllPermissions(roleIds) { 
        // Logic to get all permissions from the database
        const permissions = await PermissionModel.getByRoleIds(roleIds); 
        return permissions; 
    },

    async getUserPermissions(roleId) {
        // Logic to get user-specific permissions from the database
        const userPermissions = await PermissionModel.getRolePermissions(roleId); 
        return userPermissions; 
    },

    async create(data) { 
        // Logic to create a new permission in the database
        const newPermission = await PermissionModel.create(data); 
        return newPermission; 
    },

    async getPermissionById(id) { 
        // Logic to get a permission by ID from the database
        const permission = await PermissionModel.getById(id); 
        return permission; 
    },

    async updatePermission(id, data) { 
        // Logic to update a permission in the database
        const updatedPermission = await PermissionModel.update(id, data); 
        return updatedPermission; 
    },

    async deletePermission(id) { 
        // Logic to delete a permission from the database
        await PermissionModel.delete(id); 
        return; 
    }
};