const mongoose = require("mongoose");
const User = require("./models/user.js");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("Connected to MongoDB Atlas\n");
    
    // Check users collection using raw mongodb
    const usersRaw = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log(`Total Users: ${usersRaw.length}\n`);
    
    if (usersRaw.length > 0) {
      console.log("User Details:");
      usersRaw.forEach((user, index) => {
        console.log(`\n${index + 1}. Username: ${user.username}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Has Password Hash: ${user.hash ? 'Yes ✅' : 'No ❌'}`);
        console.log(`   Has Password Salt: ${user.salt ? 'Yes ✅' : 'No ❌'}`);
        console.log(`   Created: ${user.createdAt || 'N/A'}`);
      });
    } else {
      console.log("⚠️  NO USERS FOUND IN DATABASE!");
      console.log("You need to create a user account or migrate users from local database.");
    }
    
    // Check all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("\n\nAll Collections in Database:");
    collections.forEach(col => {
      console.log(`- ${col.name}`);
    });
    
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
