import { RoleModel } from "../roles/roles.model.js";
import { PermissionsService } from "./permissions.service.js";
export const AccessService = {
  async resolveAbilities(userId) {
    const permissions = await PermissionsService.getAllPermissions(userId);
    const roles = await RoleModel.getByUser(userId);
    
    return { roles, permissions };
  }
};
