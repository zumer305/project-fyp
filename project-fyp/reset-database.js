const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const initData = require('./init/data.js');

const url = 'mongodb://127.0.0.1:27017/wanderlust';

async function main() {
  await mongoose.connect(url);
  console.log('✅ Connected to MongoDB\n');
}

const resetAndInitialize = async () => {
  try {
    // Delete all existing listings
    await Listing.deleteMany({});
    console.log('🗑️  Cleared all existing listings\n');
    
    // Get data from data.js
    let listings = initData.data;
    console.log(`📦 Found ${listings.length} listings in data.js\n`);
    
    // Update country field to match title for each listing
    listings = listings.map(listing => {
      const title = listing.title.trim();
      const countryNames = ['Uzbekistan', 'Kazakhstan', 'Kyrgyzstan', 'Tajikistan', 'Turkmenistan', 'Azerbaijan'];
      
      // If title is a country name, set country field to that name
      if (countryNames.includes(title)) {
        return {
          ...listing,
          country: title,
          owner: '68ee890b5bc02952545d9bb6'
        };
      }
      return {
        ...listing,
        owner: '68ee890b5bc02952545d9bb6'
      };
    });
    
    // Insert all listings
    await Listing.insertMany(listings);
    console.log('✅ Inserted all listings with correct country names\n');
    
    // Verify and show count
    const byCountry = {};
    const allListings = await Listing.find({});
    allListings.forEach(l => {
      if (!byCountry[l.country]) byCountry[l.country] = 0;
      byCountry[l.country]++;
    });
    
    console.log('📊 Final count by country:');
    Object.keys(byCountry).sort().forEach(country => {
      console.log(`   ${country}: ${byCountry[country]} listing(s)`);
    });
    
    console.log('\n🎉 Done! All listings are now properly organized.');
    console.log('🔄 Refresh your browser to see the changes.\n');
    
    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error:', err);
    mongoose.connection.close();
  }
};

main().then(() => {
  resetAndInitialize();
});
