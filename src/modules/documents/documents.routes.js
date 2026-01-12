import { Router } from "express";
import { DocumentsController } from "./documents.controller.js";

const router = Router();

router.get("/:id_firma", DocumentsController.getAll);
router.post("/", DocumentsController.create);
router.get("/:id", DocumentsController.getById);
router.patch("/:id", DocumentsController.update);
router.delete("/:id", DocumentsController.delete);
router.get("/:id/employee/:id_employee", DocumentsController.getEmployeeDocs);

export default router;
