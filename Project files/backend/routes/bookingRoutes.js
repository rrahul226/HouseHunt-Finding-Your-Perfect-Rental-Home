// backend/routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddlware");
const {
  deleteBookingController,
} = require("../controllers/bookingController");

// DELETE booking by ID
router.delete("/delete-booking/:bookingId", authMiddleware, deleteBookingController);

module.exports = router;
