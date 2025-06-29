const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    renterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    method: {
      type: String,
      enum: ["UPI", "Card", "NetBanking", "Cash", "gpay", "phonepe", "paytm"],
    },
    upi: {
      type: String,
    },
    amount: {
      type: Number,
    },
    status: {
      type: String,
      default: "Pending",
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
