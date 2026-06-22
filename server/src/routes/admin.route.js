import { Router } from "express";
import { authMiddeware } from "../middlewares/auth.middleware.js";
import { getAllUsers } from "../controllers/admin.controller.js";

const router = Router();

router.route("/api/auth/admin")
    .all(authMiddeware)
    .get(getAllUsers)


export default router;