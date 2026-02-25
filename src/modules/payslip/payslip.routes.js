import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { PayslipController } from "./payslip.controller.js";

const router = Router();

router.get("/", auth, PayslipController.getAll);
router.get("/findBy", auth, PayslipController.findBy);
router.get("/export/excel", auth, PayslipController.export);
router.get("/export/pdf", auth, PayslipController.getByPayrollType);

export default router;
