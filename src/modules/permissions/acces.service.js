import { RoleModel } from "../roles/roles.model.js";
import { UserModel } from "../users/users.model.js";
import { PermissionsService } from "./permissions.service.js";
export const AccessService = {
  async resolveAbilities(userId) {
    const roles = await UserModel.userRoles(userId);
    const rolePermissions = []; 
    const userPermissions = await UserModel.getUserPermissions(userId);
    
    for (const role of roles) {
      const permissions = await PermissionsService.getUserPermissions(role.id_rol);
      role.permissions = permissions;
      role.permissions = [...role.permissions, ...userPermissions];
      rolePermissions.push(role);
    }
     
    return rolePermissions;
  }
};
