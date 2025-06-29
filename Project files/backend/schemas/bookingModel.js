const mongoose = require("mongoose");

const bookingModel = mongoose.Schema(
  {
    propertyId: { // ✅ fixed typo here (was `propertId`)
      type: mongoose.Schema.Types.ObjectId,
      ref: "propertyschema", // ✅ ensure this matches your property model name
    },
    ownerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ ensure your user model is named 'user'
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userName: {
      type: String,
      required: [true, "Please provide a User Name"],
    },
    phone: {
      type: Number,
      required: [true, "Please provide a Phone Number"],
    },
    bookingStatus: {
      type: String,
      required: [true, "Please provide a booking Type"],
    },
  },
  {
    strict: false,
  }
);

const bookingSchema = mongoose.model("bookingschema", bookingModel);

module.exports = bookingSchema;
