import { Router } from "express";

import { authMiddeware } from "../middlewares/auth.middleware.js";
import { ExportData } from '../controllers/export.controller.js'

const router = Router();

router.get('/api/reports/export', authMiddeware, ExportData);

export default router;