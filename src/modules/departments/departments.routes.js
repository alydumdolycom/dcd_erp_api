import { Router } from "express";
import { DepartmentsController } from "./departments.controller.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", auth, DepartmentsController.getAll);
router.get("/:id", DepartmentsController.getById);
router.post("/", DepartmentsController.create);
router.patch("/:id", DepartmentsController.update);
router.delete("/:id", DepartmentsController.delete);

export default router;
