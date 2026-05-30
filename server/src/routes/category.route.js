import express from "express";
import categoryController from "../controllers/category.controller.js";

const app = express();

const categoryRoute = () => {
    // app.route("/category")
        app.post("/category", categoryController.createCategories)
        app.get("/category", categoryController.getCategories)
    
}

export default categoryRoute;