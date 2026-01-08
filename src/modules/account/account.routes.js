import { Router } from "express";
import { AccountController } from "./account.controller.js";

const router = Router();

router.post("/forgot-password", AccountController.forgotPassword);
router.post("/reset-password/:token", AccountController.resetPassword);

export default router;
