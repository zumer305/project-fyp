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
      // The title contains the country name, use it to set the country field
      const title = listing.title.trim();

      // Check if title is a country name
      const countryNames = [
        "Uzbekistan",
        "Kazakhstan",
        "Kyrgyzstan",
        "Tajikistan",
        "Turkmenistan",
        "Azerbaijan",
      ];

      if (countryNames.includes(title)) {
        // Update country field to match the title
        listing.country = title;
        await listing.save();
        updateCount++;
        console.log(
          `✓ Updated: ${listing.location} → Country: ${listing.country}`
        );
      }
    }

    console.log(`\n✅ Updated ${updateCount} listings\n`);

    // Verify
    const byCountry = {};
    const updatedListings = await Listing.find({});
    updatedListings.forEach((l) => {
      if (!byCountry[l.country]) byCountry[l.country] = 0;
      byCountry[l.country]++;
    });

    console.log("Final count by country:");
    Object.keys(byCountry)
      .sort()
      .forEach((country) => {
        console.log(`  ${country}: ${byCountry[country]} listing(s)`);
      });

    mongoose.connection.close();
  })
  .catch((err) => console.error("Error:", err));
