// src/middleware/authorize.middleware.js
import { RolesService } from "../modules/roles/roles.service.js";
import { UsersService } from "../modules/users/users.service.js";

/**
 * Authorization middleware
 * Usage: authorize("companies.read")
 */
export function authorize(requiredPermission) {
  return async (req, res, next) => {
    try {
      // 1️⃣ Must be authenticated first
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          message: "Access interzis"
        });
      }

      const userId = req.user.id;
      // 2️⃣ Load user with roles + permissions
      const user = await UsersService.getUserAccess(userId);
      console.log("User access info:", user);
      if (!user || !user[0].nume_rol) {
        return res.status(403).json({
          message: "Access interzis"
        });
      }

      // 3️⃣ Collect all permissions from all roles
      // user.access is now an array of roles: [{ id_rol, nume_rol }]
      // For each role, fetch its permissions from UsersService.getRolePermissions
      let permissions = [];
      for (const role of user) {
        const rolePermissions = await RolesService.getRolePermissions(role.id_rol);
        permissions.push(...rolePermissions.map(perm => perm.name));
      }

      const userPermissions = await UsersService.getPermissions(userId);
      permissions.push(...userPermissions.map(perm => perm.name));
      if (!permissions.includes(requiredPermission)) {
        return res.status(403).json({
          message: "Access interzis"
        });
      }
      next();
    } catch (err) {
      console.error("Eroare la autorizare:", err);
      return res.status(500).json({
        message: "Eroare internă a serverului"
      });
    }
  };
}
