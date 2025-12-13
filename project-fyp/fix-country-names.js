const mongoose = require('mongoose');
const Listing = require('./models/listing.js');

mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
  .then(async () => {
    console.log('Connected to DB');
    
    const listings = await Listing.find({});
    console.log(`Found ${listings.length} listings\n`);
    
    let updateCount = 0;
    
    for (let listing of listings) {
      // Get country name from title
      const countryName = listing.title;
      
      // Update the country field
      if (listing.country !== countryName) {
        listing.country = countryName;
        await listing.save();
        updateCount++;
        console.log(`Updated: ${listing.title} -> Country: ${listing.country}`);
      }
    }
    
    console.log(`\n✅ Updated ${updateCount} listings`);
    
    // Verify the changes
    console.log('\n=== Verification ===');
    const updatedListings = await Listing.find({});
    const countries = {};
    updatedListings.forEach(l => {
      countries[l.country] = (countries[l.country] || 0) + 1;
    });
    
    console.log('\nListings by Country:');
    Object.keys(countries).sort().forEach(country => {
      console.log(`  ${country}: ${countries[country]} listing(s)`);
    });
    
    mongoose.connection.close();
    console.log('\n✅ Done!');
  })
  .catch(err => console.error('Error:', err));
