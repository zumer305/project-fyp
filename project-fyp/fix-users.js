const mongoose = require("mongoose");
const User = require("./models/user.js");
require("dotenv").config();

// IMPORTANT: You'll need to set passwords for all users
// This script will create new users with proper password hashing

const usersToCreate = [
  { username: "abc", email: "abc@gmail.com", password: "password123" },
  { username: "abcd", email: "abcd@gmail.com", password: "password123" },
  { username: "zumer", email: "zumer@gmail.com", password: "password123" },
  { username: "jd", email: "jd@gmail.com", password: "password123" },
  { username: "def", email: "def@gmail.com", password: "password123" },
  { username: "ghi", email: "ghi@gmail.com", password: "password123" },
  { username: "testuser", email: "test@example.com", password: "password123" },
  { username: "zumerniaz", email: "zumerniaz305@gmail.com", password: "password123" },
];

async function recreateUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB Atlas\n");

    // Delete all existing users (they have no passwords anyway)
    await User.deleteMany({});
    console.log("✅ Deleted all existing users\n");

    console.log("Creating users with proper password hashing:\n");

    for (const userData of usersToCreate) {
      const user = new User({
        email: userData.email,
        username: userData.username,
        role: "user",
      });

      // This properly creates hash and salt
      const registeredUser = await User.register(user, userData.password);
      console.log(`✅ Created user: ${userData.username} (${userData.email})`);
    }

    console.log("\n🎉 All users recreated successfully!");
    console.log("\n⚠️  DEFAULT PASSWORD FOR ALL USERS: password123");
    console.log("   Users should change their passwords after logging in.\n");

    // Verify
    const allUsers = await User.find({});
    console.log(`\nVerification:`);
    allUsers.forEach((u) => {
      console.log(
        `- ${u.username}: Hash=${!!u.hash}, Salt=${!!u.salt}`
      );
    });

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

recreateUsers();
