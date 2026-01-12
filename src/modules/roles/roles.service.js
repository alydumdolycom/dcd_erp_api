import { addError } from "../../utils/validators.js";
import { RoleModel } from "./roles.model.js";

export const RolesService = {
    async getAllRoles() {
        return await RoleModel.all();
    },

    async getRoleById(id) {
        return await RoleModel.findById(id);
    },

    async create(data) {
        const errors = {};
        const findRole = await RoleModel.findRole(data.nume_rol);
        if (findRole) {
            addError(errors, "nume_rol", "Rolul exista deja");
        }
        if (Object.keys(errors).length > 0) {
            return { errors };
        }
        return await RoleModel.create(data);   
    },

    async updateRole(id, roleData) {
        return await RoleModel.update(id, roleData);   
    },

    async deleteRole(id) {
        return await RoleModel.delete(id);   
    },
    async getUserRoles(userId) {
        return await RoleModel.userRoles(userId);
    },

    async getUserRoles(userId) {
        return await RoleModel.getRoles(userId);
    },
    
    async syncRoles(id, roles) {
    return await RoleModel.syncRoles(id, roles);
    }
};