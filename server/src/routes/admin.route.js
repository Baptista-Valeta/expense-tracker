import { Router } from "express";

import { authMiddeware } from "../middlewares/auth.middleware.js";
import { getAllUsers, deleteUser } from "../controllers/admin.controller.js";

const router = Router();

router.route("/api/auth/admin")
    .all(authMiddeware)
    .get(getAllUsers)

router.delete('/api/auth/admin/remove/:id', authMiddeware, deleteUser)


export default router;