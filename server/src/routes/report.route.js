import { Router } from "express";

import { authMiddeware } from "../middlewares/auth.middleware.js";
import { getChartDataCategory, getChartDataMounthly, report } from "../controllers/report.controller.js";

const router = Router();

router.get("/api/reports/summary", authMiddeware, report);
router.get("/api/reports/chart-data-category", authMiddeware, getChartDataCategory);
router.get("/api/reports/chart-data-mounthly", authMiddeware, getChartDataMounthly);

export default router;