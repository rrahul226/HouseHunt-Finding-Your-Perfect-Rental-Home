import React, { useEffect, useState } from "react";
import axios from "axios";

const DeleteBooking = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // ✅ Define fetchBookings INSIDE useEffect — this silences ESLint properly
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        const res = await axios.get(`/api/booking/renter-booking-history/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data.bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings(); // ✅ only called once
  }, []); // ✅ safe: no dependency warning

  const deleteBooking = async (bookingId) => {
    const token = localStorage.getItem("token");

    if (window.confirm("Cancel this booking?")) {
      try {
        await axios.delete(`/api/booking/delete-booking/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
        alert("Booking cancelled successfully");
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to cancel booking");
      }
    }
  };

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
