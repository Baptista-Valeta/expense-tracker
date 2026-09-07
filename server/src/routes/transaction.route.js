import { Router } from "express";

import transactionController from "../controllers/transaction.controller.js";
import { authMiddeware } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/api/transactions")
    .all(authMiddeware)
    .post(transactionController.createTransaction)
    .get(transactionController.getAllTransaction)

router.route("/api/transactions/:id")
    .all(authMiddeware)
    .get(transactionController.getIdTransaction)
    .put(transactionController.updateTransaction)
    .delete(transactionController.deleteTransaction)

export default router;