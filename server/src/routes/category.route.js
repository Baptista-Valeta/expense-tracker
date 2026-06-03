import { Router } from "express";
import categoryController from "../controllers/category.controller.js";

const router = Router();

// rota para vários registros
router.route("/api/categories")   
    .post(categoryController.createCategories)
    .get(categoryController.getAllCategories)

// rota para um só registro
router.get("/api/categories/:id", categoryController.getIdCategory);
router.put("/api/categories/:id", categoryController.updateIdCategory)
router.delete("/api/categories/:id", categoryController.deleteIdCategory);

export default router;