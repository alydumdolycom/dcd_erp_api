import { Router } from "express";
import { PermissionsController } from "./permissions.controller.js";
const router = Router();

router.get("/", PermissionsController.getAll);
router.get("/:id", PermissionsController.getById);
router.post("/",PermissionsController.create);
router.patch("/:id", PermissionsController.update);
router.delete("/:id", PermissionsController.delete);
export default router;
