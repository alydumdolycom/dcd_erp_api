import { RoleModel } from "../roles/roles.model.js";
import { UserModel } from "../users/users.model.js";
import { PermissionsService } from "./permissions.service.js";
export const AccessService = {
  async resolveAbilities(userId) {
    const roles = await UserModel.userRoles(userId);
    const permissions = []; 
    const userPermissions = await UserModel.getUserPermissions(userId);
    
    for (const role of roles) {
      const rolePermissions = await UserModel.getRolePermissions(role.id_rol);
      permissions.push(...rolePermissions);
    }
     
    return {
      permissions,
      userPermissions
    };
  }
};
