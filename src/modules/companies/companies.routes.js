import { Router } from "express";
import { CompaniesController } from "./companies.controller.js";
const router = Router();

router.get("/", CompaniesController.getAll);
router.get("/:id", CompaniesController.getBy);
router.post("/", CompaniesController.create);
router.patch("/:id", CompaniesController.update);
router.delete("/:id", CompaniesController.delete);
export default router;
