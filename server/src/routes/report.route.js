import { Router } from "express";

import { authMiddeware } from "../middlewares/auth.middleware.js";
import { getChartData, report } from "../controllers/report.controller.js";

const router = Router();

router.get("/api/reports/summary", authMiddeware, report);
router.get("/api/reports/chart-data", authMiddeware, getChartData)

export default router;