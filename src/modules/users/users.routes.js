import { Router } from "express";
import { UserController } from "./users.controller.js";
import { createUserSchema } from "./users.validation.js";
import { validate } from "../../middleware/validate.middleware.js";
import { auth } from "../../middleware/auth.middleware.js";
const router = Router();

router.post("/", validate(createUserSchema), UserController.create);

router.get("/", auth, UserController.index);
router.get("/:id", UserController.find);
router.patch("/:id", UserController.update);
router.delete("/:id", UserController.delete);

export default router;