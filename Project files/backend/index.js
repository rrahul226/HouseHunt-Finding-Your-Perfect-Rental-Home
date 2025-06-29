const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectionofDb = require("./config/connect.js");
const path = require("path");
const paymentRoutes = require("./routes/paymentRoutes");
const transactionRoutes = require("./routes/transactionRoutes");



const app = express();

////// dotenv config /////////////////////
dotenv.config();

////// connection to DB //////////////////
connectionofDb();

const PORT = process.env.PORT || 8001;

////// Middleware /////////////////////////
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // ✅ Added PATCH and DELETE
  credentials: true                                      // ✅ Allow credentials
}));

////// Static files ///////////////////////
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

////// API Routes /////////////////////////
app.use('/api/user', require('./routes/userRoutes.js'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/owner', require('./routes/ownerRoutes'));
app.use("/api/payment", require('./routes/paymentRoutes'));
app.use("/api/payment", require('./routes/transactionRoutes')); // mount on /api/payment
app.use("/api/property", require("./routes/propertyRoutes"));
app.use("/api/booking", require("./routes/bookingRoutes"));

////// Server Start ///////////////////////
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
