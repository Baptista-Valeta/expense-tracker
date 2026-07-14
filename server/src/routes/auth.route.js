import { Router } from "express";

import { deleteIdUser, loginUser, registerUser, updateUser } from "../controllers/auth.controller.js";
import { authMiddeware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/api/auth/register", registerUser);
router.post("/api/auth/login", loginUser);
router.get("/api/auth/profile", authMiddeware, (req, res) => {
    if (!req.user) {
        return res.status(404).send("Perfil de usuário não encontrado!");
    }
    return res.status(200).json({user: req.user});
});

router.put("/api/auth/profile", authMiddeware, updateUser);
router.delete("/api/auth/profile", authMiddeware, deleteIdUser);


export default router; 