import { Router } from "express";
import { LookupsController } from "./lookups.controller.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/departments", LookupsController.getDepartments);
router.get("/cities", LookupsController.getCities);
router.get("/towns/:id", LookupsController.getTowns);
router.get("/job-types", LookupsController.getJobTypes);
router.patch("/employee/mode/:id", LookupsController.editEmployeeMode);
router.get("/employee/company", auth, LookupsController.employeeCompany);

export default router;
