import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { PayslipController } from "./payslip.controller.js";

const router = Router();

router.get("/", auth, PayslipController.getAll);
router.get("/findBy", auth, PayslipController.findBy);
router.get("/payments/types", auth, PayslipController.getByPayrollType);
router.get("/export/excel", auth, PayslipController.export);
router.get("/export/pdf", auth, PayslipController.exportPdfByPayrollType);
router.get("/export/pdf/card", auth, PayslipController.getPayrollByCard);

export default router;
