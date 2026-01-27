import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { PayRollController } from "./payroll.controller.js";

const router = Router();

router.get("/", auth, PayRollController.getAll);
router.get("/:id", auth, PayRollController.getById);
router.post(
  "/",
  // validate(createEmployeeSchema),
  auth,
  PayRollController.create
);
router.patch("/:id", auth, PayRollController.update);
router.delete("/:id", auth, PayRollController.delete);
router.get("/payrolls/data", auth, PayRollController.getPayrollByDays);
export default router;
