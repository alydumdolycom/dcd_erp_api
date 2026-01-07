import { Router } from "express";
const router = Router();
import { PermissionsController } from "./permissions.controller.js";

router.get("/", PermissionsController.getAll);
router.get("/:id", PermissionsController.getById);
router.post("/", PermissionsController.create);
router.put("/:id", PermissionsController.update);
router.delete("/:id", PermissionsController.delete);

export default router;
