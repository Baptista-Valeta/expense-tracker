import { Router } from "express";
import transactionController from "../controllers/transaction.controller.js";

const router = Router();

router.route("/api/transactions")
    .post(transactionController.createTransaction)
    .get(transactionController.getAllTransaction)

router.route("/api/transactions/:id")
    .get(transactionController.getIdTransaction)
    .put(transactionController.updateTransaction)
    .delete(transactionController.deleteTransaction)

export default router;