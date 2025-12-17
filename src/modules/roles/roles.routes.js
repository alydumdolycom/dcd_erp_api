import { Router } from "express";
import { RolesController } from "./roles.controller.js";
const router = Router();

router.get("/", RolesController.getAll);
router.get("/:id", RolesController.getById);
router.post("/",RolesController.create);
router.patch("/:id", RolesController.update);
router.delete("/:id", RolesController.delete);
export default router;
