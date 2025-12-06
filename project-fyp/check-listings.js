const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const url = 'mongodb://127.0.0.1:27017/wanderlust';

async function checkData() {
  try {
    await mongoose.connect(url);
    console.log("Connected to DB");
    
    const count = await Listing.countDocuments({});
    console.log(`Total listings in DB: ${count}`);
    
    if (count === 0) {
      console.log("\n⚠️  Database is EMPTY!");
      console.log("You need to run: node init/index.js");
    } else {
      const first = await Listing.findOne({});
      console.log("\nFirst listing:", first.title);
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

checkData();
