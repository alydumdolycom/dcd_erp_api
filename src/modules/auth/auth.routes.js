import { Router } from "express";
import { AuthController } from "./auth.controller.js";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/recover", AuthController.recover);
router.post("/reset", AuthController.resetPassword);

export default router;
