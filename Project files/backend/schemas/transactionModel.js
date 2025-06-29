const mongoose = require("mongoose");

    const transactionSchema = new mongoose.Schema(
  {
    bookingId: String,
    ownerId: String,
    renterId: String,
    amount: Number,
    paymentMethod: String,
    details: Object,
    status: { type: String, default: "Success" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
