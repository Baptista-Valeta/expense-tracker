import { loginUser, registerUser } from "../controllers/auth.controller.js";
import { Router } from "express";
import { authMiddeware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/api/register", registerUser);
router.post("/api/login", loginUser);
router.get("/api/profile", authMiddeware, (req, res) => {
    return res.status(200).json({user: req.user});
});

export default router; 