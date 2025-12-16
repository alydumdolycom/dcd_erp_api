import { Router } from "express";
import { LookupsController } from "./lookups.controller.js";

const router = Router();

router.get("/departments", LookupsController.getDepartments);
router.get("/cities", LookupsController.getCities);
router.get("/towns", LookupsController.getTowns);
router.get("/job-types", LookupsController.getJobTypes);

export default router;
