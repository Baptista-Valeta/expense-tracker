import { Router } from "express";

const router = Router();

router.get("/api/", (req, res) => {
    res.json({
        status: "online",
        name_server: "Expense-Tracker",
        server: "Nodejs + Express",
        database: "MongoDB Local"
    });
})

export default router;