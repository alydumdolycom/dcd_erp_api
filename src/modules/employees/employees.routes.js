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
  // validate(createEmployeeSchema),
  EmployeesController.create
);
router.patch("/:id", auth, EmployeesController.update);
router.delete("/:id", auth, EmployeesController.delete);
router.get("/employee/company", auth, EmployeesController.employeeCompany);
router.post("/mod/edit/employee", auth, EmployeesController.modEditEmployee);
router.get("/features", auth, EmployeesController.getEmployeeFeatures);
router.get("/list/in/salaries", auth, EmployeesController.getEmployeesList);
router.patch("/list/in/salaries/:id", auth, EmployeesController.updateEmployeesList);
router.post("/calculate/salaries/brut/to/net", auth, EmployeesController.calculateBrutToNetSalary);
router.post("/calculate/salaries/net/to/brut", auth, EmployeesController.calculateNetToBrutSalary);
// router.get("/payment/methods/:id_salariat", auth, EmployeesController.getEmployeePaymentMethods);
router.get("/payment/methods/:id_salariat", auth, EmployeesController.getEmployeePaymentMethodForHoliday);
router.get("/employee/files", auth, EmployeesController.employeeFiles);
router.get("/employee/contract/pdf", auth, EmployeesController.generateContractPDF);
router.post("/validate/payroll/data", auth, EmployeesController.validateEmployeeData);

export default router;
