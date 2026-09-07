import { Router } from "express";

import { authMiddeware } from "../middlewares/auth.middleware.js";
import { getChartDataCategory, getChartDataMounthly, getIncomeCategories, report, reportAverage, reportComparisonIncome } from "../controllers/report.controller.js";

const router = Router();

router.get("/api/reports/summary", authMiddeware, report);
router.get("/api/reports/chart-data-category", authMiddeware, getChartDataCategory);
router.get("/api/reports/chart-data-mounthly", authMiddeware, getChartDataMounthly);
router.get("/api/reports/category-income", authMiddeware, getIncomeCategories);
router.get('/api/reports/average', authMiddeware, reportAverage);
router.get('/api/reports/comparison-income', authMiddeware, reportComparisonIncome);

export default router;