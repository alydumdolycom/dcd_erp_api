import { Router } from "express";
import { PaymentsController } from "./payments.controller.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", auth, PaymentsController.getAll);
router.post("/", auth, PaymentsController.create);
router.patch("/:id", auth, PaymentsController.update);
router.delete("/:id", auth, PaymentsController.delete);

export default router;