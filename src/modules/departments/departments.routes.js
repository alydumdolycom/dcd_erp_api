import { Router } from "express";
import { DepartmentsController } from "./departments.controller.js";

const router = Router();

router.get("/", DepartmentsController.getAll);
router.get("/:id", DepartmentsController.getById);
router.post("/", DepartmentsController.create);
router.patch("/:id", DepartmentsController.update);
router.delete("/:id", DepartmentsController.delete);

export default router;
