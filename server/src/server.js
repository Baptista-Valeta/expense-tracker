// import dotenv from "dotenv"
// dotenv.config()

import express from "express";
import { connectDB } from "./config/database.js";
import categoryRoute from "./routes/category.route.js";

const app = express();
app.use(express.json());

app.set("port", 5000);
await connectDB(); // conecta ao banco

app.get("/", (req, res) => {
    res.json({
        status: "online",
        name_server: "Expense-Tracker",
        timestamp: true
    });
});

categoryRoute();

app.listen(app.get("port"), () => {
    console.log("Servidor rodando na porta", app.get("port"));
})