import { Router } from "express";
import { UserController } from "./users.controller.js";
import { createUserSchema } from "./users.validation.js";
import { validate } from "../../middleware/validate.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";

const router = Router();

router.get("/", authorize("admin.utilizatori.citire"), UserController.getAll);
router.get("/:id",  authorize("admin.utilizatori.citire"), UserController.find);
router.post("/", authorize("admin.utilizatori.adauga"), validate(createUserSchema), UserController.create);
router.patch("/:id", authorize("admin.utilizatori.editare"), UserController.update);
router.delete("/:id", authorize("admin.utilizatori.sterge"), UserController.delete);
router.post("/sync/roles/:id", authorize("admin.utilizatori.editare"), UserController.syncRoles);

export default router;  