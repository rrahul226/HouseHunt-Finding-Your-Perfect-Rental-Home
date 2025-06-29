const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddlware");

// ✅ Correctly import from the right controller file
const {
  submitPayment,
  getOwnerTransactions,
  getRenterTransactions,
} = require("../controllers/paymentController"); // not transactionController

// ✅ Remove duplicate route
router.post("/submit", authMiddleware, submitPayment);
// backend/routes/transactionRoutes.js
router.post("/pay-to-owner", authMiddleware, submitPayment);


router.get("/renter/:renterId", authMiddleware, getRenterTransactions);
router.get("/owner/:ownerId", authMiddleware, getOwnerTransactions);

module.exports = router;
