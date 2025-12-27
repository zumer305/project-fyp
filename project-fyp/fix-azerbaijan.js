const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

mongoose
  .connect("mongodb://127.0.0.1:27017/wanderlust")
  .then(async () => {
    console.log("Connected to DB\n");

    const listings = await Listing.find({});
    console.log(`Found ${listings.length} listings\n`);

    let updateCount = 0;

    for (let listing of listings) {
      // Check if the title is a country name
      const title = listing.title.trim();
      const countryNames = [
        "Uzbekistan",
        "Kazakhstan",
        "Kyrgyzstan",
        "Tajikistan",
        "Turkmenistan",
        "Azerbaijan",
      ];

      // Update country field to match title if it's a country name
      if (countryNames.includes(title) && listing.country !== title) {
        listing.country = title;
        await listing.save();
        updateCount++;
        console.log(`✓ Updated: ${listing.location} → ${listing.country}`);
      }
    }

    console.log(`\n✅ Updated ${updateCount} listings\n`);

    // Show final count
    const byCountry = {};
    const updatedListings = await Listing.find({});
    updatedListings.forEach((l) => {
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
  })
  .catch((err) => console.error("Error:", err));
