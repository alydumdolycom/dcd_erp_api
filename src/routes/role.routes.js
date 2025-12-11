import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js";
import {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
} from "../controllers/Roles/role.controller.js";

const router = Router();

// router.get("/roluri", auth,  getRoles);
// router.get("/roluri/:id", getRoleById);
// router.post("/roluri", createRole);
// router.put("/roluri/:id", updateRole);
// router.delete("/:id", deleteRole);
router.get("/roluri", auth, getRoles);
router.get("/roluri/:id", auth, getRoleById);
router.post("/roluri", auth, createRole);
router.patch("/roluri/:id", auth, updateRole);
router.delete("roluri//:id", auth, deleteRole);
export default router;
