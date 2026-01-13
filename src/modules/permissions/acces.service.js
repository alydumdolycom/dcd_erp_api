import { RoleModel } from "../roles/roles.model.js";
import { UserModel } from "../users/users.model.js";
import { PermissionsService } from "./permissions.service.js";
export const AccessService = {
  async resolveAbilities(userId) {
    const permissions = await PermissionsService.getAllPermissions(userId);
    const roles = await UserModel.userRoles(userId);
    
    return { roles, permissions };
  }
};
