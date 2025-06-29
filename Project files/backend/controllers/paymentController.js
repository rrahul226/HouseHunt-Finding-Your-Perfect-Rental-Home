const Payment = require("../schemas/paymentModel");
const Transaction = require("../schemas/transactionModel");

// ✅ For finalized payment (used in /api/payment/finalize)
const finalizePayment = async (req, res) => {
  try {
    const { bookingId, renterId, ownerId, amount, method } = req.body;

    const newPayment = new Payment({
      bookingId,
      renterId,
      ownerId,
      amount,
      method,
      status: "Completed",
      paidAt: new Date(),
    });

    await newPayment.save();

    res.status(201).json({
      success: true,
      message: "Payment finalized successfully",
      data: newPayment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Payment failed", error });
  }
};

// ✅ GET: all transactions where user is renter or owner
const getUserTransactions = async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await Payment.find({
      $or: [{ renterId: userId }, { ownerId: userId }],
    })
      .populate("renterId", "name email")
      .populate("ownerId", "name email");

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ success: false, message: "Fetch failed", err });
  }
};

// ✅ POST: used in FinalizePayment.jsx
const handlePayment = async (req, res) => {
  try {
    const {
      bookingId,
      renterId,
      ownerId,
      amount,
      paymentMethod,
      details,
      status,
    } = req.body;

    const txn = new Transaction({
      bookingId,
      renterId,
      ownerId,
      amount,
      paymentMethod,
      details,
      status: status || "Pending",
    });

    await txn.save();

    res.status(200).send({
      success: true,
      message: "Payment recorded",
      data: txn,
    });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).send({ success: false, message: "Payment failed" });
  }
};

// ✅ POST: UPI/Manual amount entry - stores in Payment model
const submitPaymentController = async (req, res) => {
  try {
    const { bookingId, method, upi, amount } = req.body;

    if (!bookingId || !method || !upi || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const payment = await Payment.create({
      bookingId,
      method,
      upi,
      amount,
      status: "Success",
    });

    return res.status(200).json({
      success: true,
      message: "Payment submitted successfully",
      data: payment,
    });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ POST fallback: stores payment in Transaction model (for flexibility)
const submitPayment = async (req, res) => {
  try {
    const { bookingId, renterId, ownerId, amount, paymentMethod, details } = req.body;

    if (!bookingId || !renterId || !ownerId) {
      return res.status(400).send({
        success: false,
        message: "Missing booking, renter, or owner info",
      });
    }

    const transaction = new Transaction({
      bookingId,
      renterId,
      ownerId,
      amount,
      paymentMethod,
      details,
      status: "Success",
    });

    await transaction.save();

    res.status(200).send({
      success: true,
      message: "Payment Recorded as Success (fallback)",
      data: transaction,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// ✅ GET: owner-specific transactions
const getOwnerTransactions = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const txns = await Transaction.find({ ownerId }).populate("renterId", "name email");
    res.status(200).json(txns);
  } catch (err) {
    res.status(500).json({ success: false, message: "Fetch failed", err });
  }
};

// ✅ GET: renter-specific transactions
const getRenterTransactions = async (req, res) => {
  try {
    const { renterId } = req.params;

    const txns = await Transaction.find({ renterId }).populate("ownerId", "name email");
    res.status(200).json(txns);
  } catch (err) {
    res.status(500).json({ success: false, message: "Fetch failed", err });
  }
};

module.exports = {
  finalizePayment,
  getUserTransactions,
  handlePayment,
  submitPaymentController,
  submitPayment,
  getOwnerTransactions,
  getRenterTransactions,
};
