// src/modules/users/users.service.js
import { UserModel } from "./users.model.js";
import { RolesService } from "../roles/roles.service.js";

export const UsersService = {

  async getAll(data) {
    return await UserModel.all(data);
  },

  async getById(id) {
    return await UserModel.findById(id);
  },

  async create(data) {
    // Business logic: ensure unique email & name
    const existingEmail = await UserModel.findByEmail(data.email);
    if (existingEmail) {
      return { error: "Email already in use", code: "EMAIL_EXISTS" };
    }
    const existingName = await UserModel.findByName(data.nume_complet);
    if (existingName) {
      return { error: "Nume complet already in use", code: "NAME_EXISTS" };
    }
    const user = await UserModel.create(data);
    // Assign role after user creation
    if (data.role_id) {
      // Import RolesModel at the top of the file
      // import { RolesModel } from "../roles/roles.model.js";
      await RolesService.assignRoleToUser(user.id_utilizator, data.role_id);
    }
    return { data: user };
  },

  async update(id, data) {
    // optional: add checks if updating email -> unique
    if (data.email) {
      const byEmail = await UserModel.findByEmail(data.email);
      if (byEmail && String(byEmail.id_utilizator) !== String(id)) {
        return { error: "Email deja folosit", code: "EMAIL_EXISTS" };
      }
    }
    if (data.nume_complet) {
      const byName = await UserModel.findByName(data.nume_complet);
      if (byName && String(byName.id_utilizator) !== String(id)) {
        return { error: "Numele complet deja folosit", code: "NAME_EXISTS" };
      }
    }
    return await UserModel.update(id, data);
  },

  async softDelete(id) {
    return await UserModel.softDelete(id);
  },

  async syncRoles(userId, roles) {
    return await UserModel.syncRoles(userId, roles);
  },

  async assignRoleToUser(userId, roles) {
    return await UserModel.assignRoleToUser(userId, roles);
  },

  async getUserRoles(userId) {
    return await UserModel.getRoles(userId);
  },

  async getPermissions(userId) {
    return await UserModel.getPermissions(userId);
  }
};
