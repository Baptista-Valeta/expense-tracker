import dotenv from "dotenv"
dotenv.config()

import express from "express";
import { connectDB } from "./config/database.js";
import userModel from "./models/user.model.js";

const app = express();

app.set("port", 5000);
await connectDB(); // conecta ao banco

app.get("/", (req, res) => {
    res.json({
        status: "online",
        name_server: "Expense-Tracker",
        timestamp: true
    });
});

// Lista os users
app.get("/users", (req, res) => {
    userModel.find().select()
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            res.sendStatus(404).send(error.message);
        });
});

app.listen(app.get("port"), () => {
    console.log("Servidor rodando na porta", app.get("port"));
})