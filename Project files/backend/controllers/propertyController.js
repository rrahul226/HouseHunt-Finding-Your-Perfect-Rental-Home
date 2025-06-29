const Property = require("../schemas/propertyModel");

// DELETE Property
const deletePropertyController = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const deleted = await Property.findByIdAndDelete(propertyId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    res.status(200).json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

module.exports = { deletePropertyController };
