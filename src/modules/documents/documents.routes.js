import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { DocumentsController } from "./documents.controller.js";

const router = Router();

router.get("/", auth, DocumentsController.getAll);
router.post("/", auth, DocumentsController.create);
router.get("/:id", auth, DocumentsController.getById);
router.put("/:id", auth, DocumentsController.update);
router.delete("/:id", auth, DocumentsController.delete);
export default router;
