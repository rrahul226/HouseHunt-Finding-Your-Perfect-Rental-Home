const express = require("express");
const {
  loginAdmin,
  getAllUsersController,
  handleStatusController,
  getAllPropertiesController,
  getAllBookingsController,
  approveUserController,
  deleteUserController
} = require("../controllers/adminController");

const router = express.Router();


// Admin login
router.post("/login", loginAdmin);

// Admin data routes
router.get("/getallusers", getAllUsersController);
router.post("/changestatus", handleStatusController);
router.post("/handlestatus", handleStatusController);

// ✅ Add routes for approving and deleting users
router.patch("/approve/:id", approveUserController);
router.delete("/delete/:id", deleteUserController);

// Properties & Bookings
router.get("/getallproperties", getAllPropertiesController);
router.get("/getallbookings", getAllBookingsController);

module.exports = router;
