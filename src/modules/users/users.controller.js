// src/modules/users/users.controller.js
import { AccessService } from "../permissions/acces.service.js";
import { PermissionsService } from "../permissions/permissions.service.js";
import { RoleModel } from "../roles/roles.model.js";
import { RolesService } from "../roles/roles.service.js";
import { UsersService } from "./users.service.js";

export const UserController = {

  async getAll(req, res, next) {
    try {
      const users = await UsersService.getAll(req.params);
      return res.json({
        success: true,
        data: users
      });
    } catch (err) {
      next({ status: 500, message: "Eroare server." });
    }
  },
  // CREATE (Admin adds a user)
  async create(req, res) {
    try {
      const user = await UsersService.create(req.body);
      if (user.error) {
        if (user.code === "EMAIL_EXISTS" || user.code === "NAME_EXISTS") {
          return res.status(400).json({   
            success: false,
            message: user.error
          });
        }
      }
      
      return res.status(201).json({
        success: true,
        message: "Utilizator creat cu succes.",
        data: user
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

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Utilizatorul nu a fost găsit."
        });
      }

      // const roles = await UsersService.getUserRoles(id);
      // const permissions = await UsersService.getPermissions(id);
      const access = await AccessService.resolveAbilities(user.id_utilizator);
      return res.json({
        success: true,
        data: user,
        access: access
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
      const data = await UsersService.update(id, req.body);

      return res.json({
        success: true,
        message: "Informatiile au fost actualizate.",
        data: data
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
        message: "Informațiile au fost actualizate.",
        data: updatedUser
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Eroare server."
      });
    }
  }
};
