import { RoleModel } from "./roles.model.js";

export const RolesService = {
    getAllRoles: () => {
        return RoleModel.all();
    },
    getRoleById: (id) => {
        return RoleModel.findById(id);
    },
    createRole: (roleData) => {
        return RoleModel.create(roleData);   
    },
    updateRole: (id, roleData) => {
        return RoleModel.update(id, roleData);   
    },
    deleteRole: (id) => {
        return RoleModel.delete(id);   
    }
};