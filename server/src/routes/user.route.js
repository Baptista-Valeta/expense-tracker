import { Router } from "express";
import userController from "../controllers/user.controller.js";

const router = Router();

router.route("/users")
    .get(userController.getAllUser)
    .post(userController.createUser)

router.delete("/users/:id", userController.deleteIdUser);

export default router;