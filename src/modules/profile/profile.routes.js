import { Router } from "express";
import { ProfileController } from "./profile.controller.js";
// import { authorize } from "../../middleware/authorize.middleware.js";

const router = Router();

router.get("/", ProfileController.get);
router.post("/", ProfileController.update);

export default router;  