const bookingSchema = require("../schemas/bookingModel");
const propertySchema = require("../schemas/propertyModel");
const userSchema = require("../schemas/userModel");

////////// adding property by owner ////////
const addPropertyController = async (req, res) => {
  try {
    let images = [];
    if (req.files) {
      images = req.files.map((file) => ({
        filename: file.filename,
        path: `/uploads/${file.filename}`,
      }));
    }

    const user = await userSchema.findById({ _id: req.body.userId });

    const newPropertyData = new propertySchema({
      ...req.body,
      propertyImage: images,
      ownerId: user._id,
      ownerName: user.name,
      isAvailable: "Available",
    });

    await newPropertyData.save();

    return res.status(200).send({
      success: true,
      message: "New Property has been stored",
    });
  } catch (error) {
    console.log("Error in addPropertyController", error);
    return res.status(500).send({ success: false, message: "Server error" });
  }
};

/////////// get all properties of owner ////////
const getAllOwnerPropertiesController = async (req, res) => {
  try {
    const userId = req.userId; // ✅ Use from authMiddleware

    const properties = await propertySchema.find({ userId });

    return res.status(200).send({
      success: true,
      message: "Owner properties fetched successfully",
      data: properties,
    });
  } catch (error) {
    console.log("Error fetching owner's properties:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to fetch properties",
      error: error.message,
    });
  }
};


////// delete property by owner ///////
const deletePropertyController = async (req, res) => {
  const propertyId = req.params.propertyid;
  try {
    await propertySchema.findByIdAndDelete({ _id: propertyId });

    return res.status(200).send({
      success: true,
      message: "The property is deleted",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

////// updating the property ///////
const updatePropertyController = async (req, res) => {
  const { propertyid } = req.params;

  try {
    const updateData = { ...req.body };

    // Optional: handle image if sent via req.file or req.files
    if (req.file) {
      updateData.propertyImage = [
        {
          filename: req.file.filename,
          path: `/uploads/${req.file.filename}`,
        },
      ];
    } else if (req.files && req.files.length > 0) {
      updateData.propertyImage = req.files.map((file) => ({
        filename: file.filename,
        path: `/uploads/${file.filename}`,
      }));
    }

    updateData.ownerId = req.body.userId;

    const updatedProperty = await propertySchema.findByIdAndUpdate(
      { _id: propertyid },
      updateData,
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: "Property updated successfully.",
    });
  } catch (error) {
    console.error("Error updating property:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update property.",
    });
  }
};

////// get all bookings of this owner ///////
const getAllBookingsController = async (req, res) => {
  const { userId } = req.body;
  try {
    const getAllBookings = await bookingSchema.find();
    const updatedBookings = getAllBookings.filter(
      (booking) => booking.ownerID && booking.ownerID.toString() === userId
    );
    return res.status(200).send({
      success: true,
      data: updatedBookings,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

////////// handle booking status //////////
const handleAllBookingstatusController = async (req, res) => {
  const { bookingId, propertyId, status } = req.body;
  try {
    await bookingSchema.findByIdAndUpdate(
      { _id: bookingId },
      { bookingStatus: status },
      { new: true }
    );

    await propertySchema.findByIdAndUpdate(
      { _id: propertyId },
      {
        isAvailable: status === "booked" ? "Unavailable" : "Available",
      },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: `Changed the status of property to ${status}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  addPropertyController,
  getAllOwnerPropertiesController,
  deletePropertyController,
  updatePropertyController,
  getAllBookingsController,
  handleAllBookingstatusController,
};
