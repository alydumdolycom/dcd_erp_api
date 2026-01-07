import { Router } from "express";
import { UserController } from "./users.controller.js";
import { createUserSchema } from "./users.validation.js";
import { validate } from "../../middleware/validate.middleware.js";
const router = Router();

router.post("/", validate(createUserSchema), UserController.create);

router.get("/", UserController.index);
router.get("/:id", UserController.find);
router.patch("/:id", UserController.update);
router.delete("/:id", UserController.delete);
router.post("/sync/roles/:id", UserController.syncRoles);

export default router;