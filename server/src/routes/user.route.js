import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { authMiddeware } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/api/users")
    .get(userController.getAllUser)
    .post(userController.createUser)

export default router;