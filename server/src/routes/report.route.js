import { Router } from "express";
import { authMiddeware } from "../middlewares/auth.middleware.js";
import { report } from "../controllers/report.controller.js";

const router = Router();

router.get("/api/reports/summary", authMiddeware, report);

export default router;