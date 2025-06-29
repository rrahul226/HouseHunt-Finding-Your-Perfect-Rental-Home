const Booking = require("../schemas/bookingModel");

const deleteBookingController = async (req, res) => {
  try {
    console.log("Booking ID to delete:", req.params.bookingId);

    const deleted = await Booking.findByIdAndDelete(req.params.bookingId);
    if (!deleted) {
      console.log("Booking not found in DB");
      return res.status(404).send({ success: false, message: "Booking not found" });
    }
    const booking = await Booking.findById(bookingId);
if (booking.bookingStatus === "booked") {
  return res.status(400).send({ success: false, message: "Cannot delete booked bookings" });
}
await booking.deleteOne();


    console.log("Booking deleted:", deleted);
    res.status(200).send({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.log("Error in deleteBookingController:", error.message);
    res.status(500).send({ success: false, message: "Server error", error: error.message });
  }
};


module.exports = { deleteBookingController };
