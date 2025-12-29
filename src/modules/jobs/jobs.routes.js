import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { JobsController } from "./jobs.controller.js";

const router = Router();

router.get("/", auth, JobsController.getAll);
router.get("/:id", JobsController.getById);
router.post("/",JobsController.create);
router.patch("/:id", JobsController.update);
router.delete("/:id", JobsController.delete);
export default router;
