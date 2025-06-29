const express = require("express");
const router = express.Router();
const {
  finalizePayment,
  getUserTransactions,
  handlePayment, // ✅ Optional: for future alternate endpoint
} = require("../controllers/paymentController");

const authMiddleware = require("../middlewares/authMiddlware"); // ✅ use your spelling

// ✅ Existing Finalize Payment Route
router.post("/finalize", authMiddleware, finalizePayment);

// ✅ Existing Transaction Fetch Route
router.get("/transactions/:userId", authMiddleware, getUserTransactions);

// ✅ Optional: Additional route if using /pay-to-owner
router.post("/pay-to-owner", authMiddleware, handlePayment); // not mandatory if not used

module.exports = router;
