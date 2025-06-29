const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = require("./schemas/userModel"); // ✅ Path must be correct

mongoose.connect("mongodb://localhost:27017/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const hashAdmin = async () => {
  try {
    const email = "rahul028185@gmail.com";
    const newPassword = "rahul_273";

    const user = await userSchema.findOne({ email });

    if (!user) {
      console.log("❌ Admin not found with email:", email);
      return;
    }

    // ✅ Fix role here before saving
    user.role = "admin"; // force-correct the role
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    console.log("✅ Admin password hashed and updated successfully");
  } catch (error) {
    console.error("❌ Error hashing admin password:", error);
  } finally {
    mongoose.disconnect();
  }
};

hashAdmin();
