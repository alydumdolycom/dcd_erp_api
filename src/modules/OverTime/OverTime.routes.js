import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { OverTimeController } from "./OverTime.controller.js";

const router = Router();

router.get("/", auth, OverTimeController.getAll);
router.get("/:id", auth, OverTimeController.getById);
router.post("/", auth, OverTimeController.create);
router.patch("/:id", auth, OverTimeController.update);
router.delete("/:id", auth, OverTimeController.delete);


export default router;