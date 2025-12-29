import { Router } from "express";
import { EmployeesController } from "./employees.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createEmployeeSchema } from "./employees.validation.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", auth, EmployeesController.getAll);
router.get("/:id", EmployeesController.getById);
router.post(
  "/",
  validate(createEmployeeSchema),
  EmployeesController.create
);
router.patch("/:id", auth, EmployeesController.update);
router.delete("/:id", auth, EmployeesController.delete);
router.patch("/:id/mode", auth, EmployeesController.editEmployeeMode);
router.get("/employee/company", auth, EmployeesController.employeeCompany);
export default router;
