const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = require("./schemas/userModel"); // Adjust path if needed

mongoose.connect("mongodb://localhost:27017/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedAdmin = async () => {
  try {
    const email = "rahul028185@gmail.com";
    const plainPassword = "rahul_273";

    let admin = await userSchema.findOne({ email });

    if (!admin) {
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      admin = new userSchema({
        name: "Super Admin",
        email: email,
        password: hashedPassword,
        role: "admin", // ✅ make sure your schema supports this
        isApproved: true,
      });
      await admin.save();
      console.log("✅ Admin user created successfully");
    } else {
      console.log("ℹ️ Admin already exists, updating password...");
      admin.password = await bcrypt.hash(plainPassword, 10);
      await admin.save();
      console.log("✅ Admin password updated successfully");
    }
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
  } finally {
    mongoose.disconnect();
  }
};

seedAdmin();
