const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      set: function (value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["User", "Owner", "admin"],
      default: "User",
      required: [true, "Role is required"],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    granted: {
      type: String,
      enum: ["granted", "ungranted"],
      default: "ungranted",
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = mongoose.model("User", userSchema);
