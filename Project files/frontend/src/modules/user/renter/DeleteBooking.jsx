// src/modules/user/renter/DeleteBooking.jsx

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { message } from "antd"; // For better alerts

const DeleteBooking = () => {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchBookings = useCallback(async () => {
    try {
      const res = await axios.get(`/api/booking/renter-booking-history/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      message.error("Failed to load bookings");
    }
  }, [token, user._id]);

  const deleteBooking = async (bookingId) => {
  if (window.confirm("Cancel this booking?")) {
    try {
      const res = await axios.delete(`/api/booking/delete-booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setBookings(bookings.filter((b) => b._id !== bookingId));
        alert("Booking cancelled successfully");
      } else {
        alert(res.data.message || "Unable to delete booking");
      }

    } catch (error) {
      alert(error.response?.data?.message || "Error deleting booking");
      console.error("Delete error:", error);
    }
  }
};

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Cancel Your Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((b) => (
          <div key={b._id} className="border p-3 mb-3 rounded shadow-md">
            <p><strong>Property:</strong> {b.propertyId?.title || "N/A"}</p>
            <p><strong>Status:</strong> {b.status}</p>
            <button
              onClick={() => deleteBooking(b._id)}
              className="bg-red-500 text-white px-3 py-1 mt-2 rounded"
            >
              Cancel Booking
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default DeleteBooking;
