import React, { useEffect, useState } from "react";
import axios from "axios";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

 useEffect(() => {
  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await axios.get(`/api/transactions/owner/${user._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data.success) {
      setTransactions(res.data.data);
    }
  };

  fetchTransactions();
}, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Your Transactions</h2>
      <table style={{ width: "100%", border: "1px solid gray", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Details</th>
            <th>Status</th>
            <th>Paid At</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>No transactions yet</td>
            </tr>
          ) : (
            transactions.map((txn) => (
              <tr key={txn._id}>
                <td>₹{txn.amount}</td>
                <td>{(txn.paymentMethod || txn.method)?.toUpperCase()}</td>
                <td>
                  {txn.details?.upiId ||
                    txn.details?.cardNumber?.replace(/.(?=.{4})/g, "*") ||
                    "N/A"}
                </td>
                <td>{txn.status}</td>
                <td>{new Date(txn.paidAt || txn.createdAt).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
