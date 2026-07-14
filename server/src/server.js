import dotenv from "dotenv"
dotenv.config()
import express from "express";
import cors from 'cors';

import { connectDB } from "./config/database.js";
import indexRouter from "./routes/index.route.js";
import adminRoute from "./routes/admin.route.js";
import authRoute from "./routes/auth.route.js"
import reportRoute from "./routes/report.route.js";
import categoryRoute from "./routes/category.route.js";
import transactionRoute from "./routes/transaction.route.js";
const app = express();

app.use(express.json());

app.set("port", process.env.PORT);
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Accept', 'Authorization', 'Content-Type']
}));

await connectDB(); // conecta ao banco

app.use(indexRouter);
app.use(adminRoute);
app.use(authRoute);
app.use(categoryRoute);
app.use(transactionRoute);
app.use(reportRoute);

app.listen(app.get("port"), () => {
    console.log(`Servidor rodando em http://localhost:${app.get("port")}/api/`);
})