const express = require("express");
const authMiddleware = require("../middlewares/authMiddlware");

const {
  registerController,
  loginController,
  forgotPasswordController,
  authController,
  getAllPropertiesController,
  bookingHandleController,
  getAllBookingsController,
} = require("../controllers/userController");

const bookingSchema = require("../schemas/bookingModel"); // ✅ Required for new route

const router = express.Router();

// ✅ User Registration
router.post("/register", registerController);

// ✅ User Login
router.post("/login", loginController);

// ✅ Forgot Password
router.post("/forgotpassword", forgotPasswordController);

// ✅ Get All Properties (Public/Homepage)
router.get("/getAllProperties", getAllPropertiesController);

// ✅ Get Authenticated User Data
router.post("/getuserdata", authMiddleware, authController);

// ✅ Handle Booking for a Property
router.post("/bookinghandle/:propertyid", authMiddleware, bookingHandleController);

// ✅ Get All Bookings for a User (Admin or All Bookings)
router.get("/getallbookings", authMiddleware, getAllBookingsController);

// ✅ Get Bookings for Logged-in Renter (New)
router.get("/renter-bookings/:renterId", authMiddleware, async (req, res) => {
  try {
    const bookings = await bookingSchema.find({ userID: req.params.renterId });
    res.status(200).send({ success: true, data: bookings });
  } catch (err) {
    console.error("Error fetching renter bookings:", err);
    res.status(500).send({ success: false, message: "Failed to fetch bookings" });
  }
});

module.exports = router;
