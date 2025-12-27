const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

mongoose
  .connect("mongodb://127.0.0.1:27017/wanderlust")
  .then(async () => {
    console.log("Connected to DB\n");

    const listings = await Listing.find({});
    console.log(`Total Listings: ${listings.length}\n`);

    if (listings.length === 0) {
      console.log("⚠️  No listings found! Run: node init/index.js");
      mongoose.connection.close();
      return;
    }

    // Update all country fields based on title
    let updateCount = 0;
    for (let listing of listings) {
      const title = listing.title.trim();
      const countryNames = [
        "Uzbekistan",
        "Kazakhstan",
        "Kyrgyzstan",
        "Tajikistan",
        "Turkmenistan",
        "Azerbaijan",
      ];

      if (countryNames.includes(title)) {
        listing.country = title;
        await listing.save();
        updateCount++;
      }
    }

    console.log(`✅ Updated ${updateCount} listings\n`);

    // Show count by country
    const byCountry = {};
    const updated = await Listing.find({});
    updated.forEach((l) => {
      if (!byCountry[l.country]) byCountry[l.country] = 0;
      byCountry[l.country]++;
    });

    console.log("Listings by Country:");
    Object.keys(byCountry)
      .sort()
      .forEach((country) => {
        console.log(`  ${country}: ${byCountry[country]} listing(s)`);
      });

    mongoose.connection.close();
    console.log("\n✅ Done! Refresh your page now.");
  })
  .catch((err) => console.error("Error:", err));
