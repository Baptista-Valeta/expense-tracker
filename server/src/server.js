// import dotenv from "dotenv"
// dotenv.config()
import express from "express";
import { connectDB } from "./config/database.js";
import indexRouter from "./routes/index.route.js";
import userRouter from "./routes/user.route.js"; 
import categoryRoute from "./routes/category.route.js";
import transactionRoute from "./routes/transaction.route.js";

const app = express();
app.use(express.json());

app.set("port", 5000);
await connectDB(); // conecta ao banco

app.use(indexRouter);
app.use(userRouter);
app.use(categoryRoute);
app.use(transactionRoute);

app.listen(app.get("port"), () => {
    console.log("Servidor rodando na porta", app.get("port"));
})