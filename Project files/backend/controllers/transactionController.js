const Transaction = require("../schemas/transactionModel");

// ✅ Get all transactions by owner
const getOwnerTransactions = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const transactions = await Transaction.find({ ownerId }).sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error("Transaction fetch error:", error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch owner transactions",
    });
  }
};

// ✅ Get all transactions by renter
const getRenterTransactions = async (req, res) => {
  try {
    const { renterId } = req.params;

    const transactions = await Transaction.find({ renterId }).sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Renter transactions fetched successfully",
      data: transactions,
    });
  } catch (error) {
    console.error("Transaction fetch error:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching renter transactions",
      error,
    });
  }
};

module.exports = { 
  getOwnerTransactions, 
  getRenterTransactions 
};
