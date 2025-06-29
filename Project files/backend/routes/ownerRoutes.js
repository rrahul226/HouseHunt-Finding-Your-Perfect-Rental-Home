const express = require("express");
const multer = require("multer");

const authMiddlware = require("../middlewares/authMiddlware");

const {
  addPropertyController,
  getAllOwnerPropertiesController,
  deletePropertyController,
  updatePropertyController,
  getAllBookingsController,
  handleAllBookingstatusController,
} = require("../controllers/ownerController");

const bookingSchema = require("../schemas/bookingModel");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/postproperty",
  upload.array("propertyImages"),
  authMiddlware,
  addPropertyController
);

router.get("/getallproperties", authMiddlware, getAllOwnerPropertiesController);
// MISSING IN YOUR CODE:
router.get('/get-owner-properties', authMiddlware, getAllOwnerPropertiesController);


router.get("/getallbookings", authMiddlware, getAllBookingsController);

router.post("/handlebookingstatus", authMiddlware, handleAllBookingstatusController);

router.delete(
  "/deleteproperty/:propertyid",
  authMiddlware,
  deletePropertyController
);

router.patch(
  "/updateproperty/:propertyid",
  upload.single("propertyImage"),
  authMiddlware,
  updatePropertyController
);

// ✅ New Route: Get bookings for specific owner
router.get("/bookings/:ownerId", authMiddlware, async (req, res) => {
  try {
    const bookings = await bookingSchema.find({ ownerId: req.params.ownerId });
    res.status(200).send({ success: true, data: bookings });
  } catch (err) {
    console.error("Error fetching owner bookings:", err);
    res.status(500).send({ success: false, message: "Failed to fetch bookings" });
  }
});

module.exports = router;
