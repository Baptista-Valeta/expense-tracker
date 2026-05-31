import { Router } from "express";
import transactionController from "../controllers/transaction.controller.js";

const router = Router();

router.route("/transaction")
    .post(transactionController.createTransaction)
    .get(transactionController.getAllTransaction)

router.route("/transaction/:id")
    .get(transactionController.getIdTransaction)
    .put(transactionController.updateTransaction)
    .delete(transactionController.deleteTransaction)

export default router;