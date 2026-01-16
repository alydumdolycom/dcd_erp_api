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

    async updateRole(id, data) {
        return await RoleModel.update(id, data);   
    },

    async deleteRole(id) {
        return await RoleModel.delete(id);   
    }
};