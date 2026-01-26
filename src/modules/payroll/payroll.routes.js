import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", auth, PayRollController.getAll);
router.get("/:id", PayRollController.getById);
router.post(
  "/",
  // validate(createEmployeeSchema),
  PayRollController.create
);
router.patch("/:id", auth, PayRollController.update);
router.delete("/:id", auth, PayRollController.delete);
export default router;
