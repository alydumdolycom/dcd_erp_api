import { Router } from "express";
import { AccountRecoveryController } from "./account.recovery.controller.js";

const router = Router();

router.post("/forgot-password", AccountRecoveryController.forgotPassword);
router.post("/reset-password", AccountRecoveryController.resetPassword);

export default router;
