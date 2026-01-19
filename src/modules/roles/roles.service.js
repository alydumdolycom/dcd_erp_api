import { addError } from "../../utils/validators.js";
import { RoleModel } from "./roles.model.js";

export const RolesService = {
    async getAllRoles() {
        return await RoleModel.all();
    },

    async getRoleById(id) {

        const role = await RoleModel.findById(id);
        if (!role) {
            return null;
        }

        return role;
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

    async updateRole(id, data) {
        return await RoleModel.update(id, data);   
    },

    async deleteRole(id) {
        // Check if the role is used (assuming a method RoleModel.isRoleUsed)
        const isUsed = await RoleModel.roleUsed(id);      
        if (isUsed) {
            return true; // Role is used, cannot delete
        }   
        return await RoleModel.delete(id);   
    },

    async getRolePermissions(roleId) {
        return await RoleModel.getRolePermissions(roleId);
    }
};