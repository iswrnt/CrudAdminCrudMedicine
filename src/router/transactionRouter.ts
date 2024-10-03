import { Router } from "express";
import { createTransaction, deleteTransaction, readTransaction, updateTransaction } from "../controller/transactionController";
import { createValidation, updateValidation } from "../middleware/transactionValidation";
import { verifyToken } from "../middleware/authorization";

const router = Router()
router.post(`/`,[verifyToken,createValidation] ,createTransaction)
router.get(`/`,[verifyToken] ,readTransaction)
router.put(`/`,[verifyToken,updateValidation],updateTransaction)
router.delete(`/`,[verifyToken],deleteTransaction)
export default router