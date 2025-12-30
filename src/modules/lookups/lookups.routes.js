import { Router } from "express";
import { LookupsController } from "./lookups.controller.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/cities", auth, LookupsController.getCities);
router.get("/towns/:id", auth, LookupsController.getTowns);
router.get("/contract/types", auth, LookupsController.getContractTypes);
router.get("/dashboard/count/:id", auth, LookupsController.dashboardCount);
export default router;
