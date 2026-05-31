import { Router } from "express";
import categoryController from "../controllers/category.controller.js";

const router = Router();

// rota para vários registros
router.route("/category")   
    .post(categoryController.createCategories)
    .get(categoryController.getAllCategories)

// rota para um só registro
router.get("/category/:id", categoryController.getIdCategory);
router.put("/category/:id", categoryController.updateIdCategory)
router.delete("/category/:id", categoryController.deleteIdCategory);

export default router;