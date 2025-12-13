const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

mongoose
  .connect("mongodb://127.0.0.1:27017/wanderlust")
  .then(async () => {
    console.log("Connected to DB\n");
    const listings = await Listing.find({});
    console.log(`Total Listings: ${listings.length}\n`);

    // Group by country
    const byCountry = {};
    listings.forEach((l) => {
      if (!byCountry[l.country]) {
        byCountry[l.country] = [];
      }
      byCountry[l.country].push(l);
    });

    console.log("Listings by Country:");
    Object.keys(byCountry)
      .sort()
      .forEach((country) => {
        console.log(`\n${country}: ${byCountry[country].length} listing(s)`);
        byCountry[country].forEach((l) => {
          console.log(`  - ${l.title} (${l.location})`);
        });
      });

    mongoose.connection.close();
  })
  .catch((err) => console.error("Error:", err));
