// src/modules/users/users.service.js
import { UserModel } from "./users.model.js";
import { comparePassword, hashPassword } from "../../utils/hash.js";

export const UsersService = {
  async get(query) {
    return await UserModel.all(query);
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
    const created = await UserModel.create(data);
    return { data: created };
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
        return { error: "Numele Complet deja folosit", code: "NAME_EXISTS" };
      }
    }

    const updated = await UserModel.update(id, data);
    return { data: updated };
  },

  async softDelete(id) {
    return await UserModel.softDelete(id);
  }
};
