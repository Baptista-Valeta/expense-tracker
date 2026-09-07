import { Router } from "express";

import categoryController from "../controllers/category.controller.js";
import { authMiddeware } from "../middlewares/auth.middleware.js";

const router = Router();

// rota para vários registros
router.route("/api/categories")
    .all(authMiddeware)
    .post(categoryController.createCategories)
    .get(categoryController.getAllCategories)

router.get('/api/categories/statistics', authMiddeware, categoryController.getCategoriesStatistics);

// rota para um só registro
router.get("/api/categories/:id", authMiddeware, categoryController.getIdCategory);
router.put("/api/categories/:id", authMiddeware, categoryController.updateIdCategory)
router.delete("/api/categories/:id", authMiddeware, categoryController.deleteIdCategory);

export default router;1