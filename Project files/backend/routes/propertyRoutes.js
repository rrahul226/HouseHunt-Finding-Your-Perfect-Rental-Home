const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddlware");
const { deletePropertyController } = require("../controllers/propertyController");

// DELETE Property by ID
router.delete("/delete-property/:propertyId", authMiddleware, deletePropertyController);

module.exports = router;
