// src/modules/users/users.controller.js
import { PermissionsService } from "../permissions/permissions.service.js";
import { RoleModel } from "../roles/roles.model.js";
import { RolesService } from "../roles/roles.service.js";
import { UsersService } from "./users.service.js";

export const UserController = {

  // CREATE (Admin adds a user)
  async create(req, res) {
    try {
      const { nume_complet, email, parola_hash } = req.body;
      const newUser = await UsersService.create({ nume_complet, email, parola_hash });
      if (newUser.error) {
        if (newUser.code === "EMAIL_EXISTS" || newUser.code === "NAME_EXISTS") {
          return res.status(400).json({   
            success: false,
            message: newUser.error
          });
        }
      }
      return res.status(201).json({
        success: true,
        message: "Utilizator creat cu succes.",
        data: newUser
      });

    } catch (error) {
      console.error("Create user error:", error);
      return res.status(500).json({
        success: false,
        message: "Eroare server."
      });
    }
  },

  // GET ALL (pagination, filters)
  async index(req, res) {
    try {
      const result = await UsersService.get(req.query);

      return res.json({
        success: true,
        ...result
      });

    } catch (err) {
      console.error("List users error:", err);
      return res.status(500).json({
        success: false,
        message: "Eroare server."
      });
    }
  },

  // GET BY ID
  async find(req, res) {
    try {
      const { id } = req.params;
      const user = await UsersService.getById(id);
      const roles = await RolesService.getUserRoles(id);
      const permissions = await PermissionsService.getUserPermissions(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Utilizatorul nu a fost găsit."
        });
      }

      return res.json({
        success: true,
        data: user,
        roles: roles,
        permissions: permissions
      });

    } catch (err) {
      console.error("Find user error:", err);
      return res.status(500).json({
        success: false,
        message: "Eroare server."
      });
    }
  },

  // UPDATE
  async update(req, res) {
    try {
      const { id } = req.params;

      const updated = await UsersService.update(id, req.body);

      return res.json({
        success: true,
        message: "Informatiile au fost actualizate.",
        data: updated
      });

    } catch (err) {
      console.error("Update user error:", err);
      return res.status(500).json({
        success: false,
        message: "Eroare server."
      });
    }
  },

  // DELETE (soft delete)
  async delete(req, res) {
    try {
      const { id } = req.params;

      await UsersService.softDelete(id);

      return res.json({
        success: true,
        message: "Utilizator dezactivat (soft delete)."
      });

    } catch (err) {
      console.error("Delete user error:", err);
      return res.status(500).json({
        success: false,
        message: "Eroare server."
      });
    }
  },

  async syncRoles(req, res) {
    try {
      const { id } = req.params;
      const { roles } = req.body;
      const updatedUser = await UsersService.syncRoles(id, roles);

      return res.json({
        success: true,
        message: "Roluri sincronizate cu succes.",
        data: updatedUser
      });
    } catch (err) {
      console.error("Sync roles error:", err);
      return res.status(500).json({
        success: false,
        message: "Eroare server."
      });
    }
  }
};
