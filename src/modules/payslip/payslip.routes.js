import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { PayslipController } from "./payslip.controller.js";

const router = Router();

router.get("/", auth, PayslipController.getAll);

export default router;
