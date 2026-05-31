import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.json({
        status: "online",
        name_server: "Expense-Tracker",
        timestamp: true
    });
})

export default router;