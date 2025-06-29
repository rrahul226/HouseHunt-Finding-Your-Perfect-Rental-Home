const jwt = require("jsonwebtoken");
const User = require("../schemas/userModel");

// ✅ Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers["authorization"];

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        message: "Authorization header missing or malformed",
        success: false,
      });
    }

    const token = authorizationHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_KEY || "your_jwt_secret", (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Token is not valid",
          success: false,
        });
      } else {
        // ✅ Set all safe variations
        req.body.userId = decoded.id;  // your existing logic
        req.userId = decoded.id;       // recommended for controller use
        req.user = decoded;            // for full decoded payload access

        next();
      }
    });
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
};

// ✅ isAdmin Middleware
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).send({
        message: "Not authorized",
        success: false,
      });
    }
    next();
  } catch (error) {
    console.error("isAdmin Middleware Error:", error);
    res.status(500).send({
      message: "Auth error",
      success: false,
    });
  }
};

// ✅ Export
module.exports = authMiddleware;
module.exports.isAdmin = isAdmin;
