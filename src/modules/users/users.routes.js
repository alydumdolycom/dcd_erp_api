import { Router } from "express";
import { UserController } from "./users.controller.js";
import { createUserSchema } from "./users.validation.js";
import { validate } from "../../middleware/validate.middleware.js";
// import Authorize from "../../middleware/authorize.middleware.js";

const router = Router();


router.get("/", UserController.list); 
router.post("/", validate(createUserSchema), UserController.create);
router.patch("/:id", UserController.update);
router.delete("/:id", UserController.delete);
router.post("/sync/roles/:id", UserController.syncRoles);

export default router;