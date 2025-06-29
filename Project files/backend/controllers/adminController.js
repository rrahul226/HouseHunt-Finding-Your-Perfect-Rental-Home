const propertySchema = require("../schemas/propertyModel");
const userSchema = require("../schemas/userModel");
const bookingSchema = require("../schemas/bookingModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../schemas/userModel");
const Property = require("../schemas/propertyModel");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // For local dev

//////// ✅ Admin Login Controller ///////////
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await userSchema.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

///////// ✅ Get All Users ///////////
const getAllUsersController = async (req, res) => {
  try {
    const allUsers = await userSchema.find({});
    if (!allUsers) {
      return res.status(401).send({
        success: false,
        message: "No users presents",
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "All users",
        data: allUsers,
      });
    }
  } catch (error) {
    console.log("Error in getAllUsersController:", error);
    return res.status(500).send({ success: false, message: "Server error" });
  }
};

///////// ✅ Updated handleStatusController with logging and validation ///////////
const handleStatusController = async (req, res) => {
  const { userId, status } = req.body;

  console.log("Incoming POST /handlestatus", { userId, status });

  if (!userId || typeof status === "undefined") {
    return res.status(400).json({ success: false, message: "Missing userId or status" });
  }

  try {
    const user = await userSchema.findByIdAndUpdate(
      userId,
      { isApproved: status },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "Status updated", user });
  } catch (err) {
    console.error("❌ Error in handleStatusController:", err);
    res.status(500).json({ success: false, message: "Failed to update status", error: err.message });
  }
};

///////// ✅ Approve User by ID (PATCH) ///////////
const approveUserController = async (req, res) => {
  try {
    const user = await userSchema.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }
    res.status(200).send({ success: true, message: "User approved", user });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

///////// ✅ Delete User by ID (DELETE) ///////////
const deleteUserController = async (req, res) => {
  try {
    const userId = req.params.id;

    // 1. Delete all properties of this user
    await Property.deleteMany({ ownerId: userId });

    // 2. Then delete the user
    await User.findByIdAndDelete(userId);

    return res.status(200).send({
      success: true,
      message: "User and all associated properties deleted successfully",
    });
  } catch (error) {
    console.log("Delete user error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to delete user",
    });
  }
};

///////// ✅ Get All Properties ///////////
const getAllPropertiesController = async (req, res) => {
  try {
    const allProperties = await propertySchema.find({});
    if (!allProperties) {
      return res.status(401).send({
        success: false,
        message: "No properties presents",
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "All properties",
        data: allProperties,
      });
    }
  } catch (error) {
    console.log("Error in getAllPropertiesController:", error);
    return res.status(500).send({ success: false, message: "Server error" });
  }
};

///////// ✅ Get All Bookings ///////////
const getAllBookingsController = async (req, res) => {
  try {
    const allBookings = await bookingSchema.find();
    return res.status(200).send({
      success: true,
      data: allBookings,
    });
  } catch (error) {
    console.log("Error in getAllBookingsController:", error);
    return res.status(500).send({ success: false, message: "Server error" });
  }
};

module.exports = {
  loginAdmin,
  getAllUsersController,
  handleStatusController,
  approveUserController,
  deleteUserController,
  getAllPropertiesController,
  getAllBookingsController,
};
