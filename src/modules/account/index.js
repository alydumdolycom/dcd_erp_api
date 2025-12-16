import { Router } from "express";
import recoveryRoutes from "./account.recovery.routes.js";

const router = Router();

router.use("/", recoveryRoutes);

export default router;
