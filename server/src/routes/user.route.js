import { Router } from "express";
import userController from "../controllers/user.controller.js";

const router = Router();

router.route("/api/users")
    .get(userController.getAllUser)
    .post(userController.createUser)

router.delete("/api/users/:id", userController.deleteIdUser);

export default router;