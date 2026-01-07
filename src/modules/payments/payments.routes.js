import { Router } from "express";
import { PaymentsController } from "./payments.controller.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", auth, PaymentsController.getAll);

export default router;