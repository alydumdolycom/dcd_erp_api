import { Router } from "express";
import { LookupsController } from "./lookups.controller.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/cities", auth, LookupsController.getCities);
router.get("/towns/:id", auth, LookupsController.getTowns);
router.get("/contract/type", auth, LookupsController.getContractType);
router.get("/dashboard/count/:id", auth, LookupsController.dashboardCount);
router.get("/hours/worked", auth, LookupsController.hoursWorked);
router.get("/payment/type", auth, LookupsController.paymentType);
router.get("/working/days", auth, LookupsController.workingDays);

export default router;
