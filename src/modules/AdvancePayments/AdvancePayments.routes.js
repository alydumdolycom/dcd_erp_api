import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { AdvancePaymentsController } from "./AdvancePayments.controller.js";
const router = Router();

router.get("/", auth, AdvancePaymentsController.getAll);
router.get("/:id", auth, AdvancePaymentsController.getById);
router.patch("/:id", auth, AdvancePaymentsController.update);

export default router;
