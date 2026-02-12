import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { MedicalHolidaysController } from "./MedicalHolidays.controller.js";

const router = Router();

router.get("/", auth, MedicalHolidaysController.getAll);
router.get("/:id", auth, MedicalHolidaysController.getById);
router.post("/", auth, MedicalHolidaysController.create);
router.patch("/:id", auth, MedicalHolidaysController.update);
router.delete("/:id", auth, MedicalHolidaysController.delete);
router.get("/nom/medical/data", auth, MedicalHolidaysController.getMedicalData);

export default router;