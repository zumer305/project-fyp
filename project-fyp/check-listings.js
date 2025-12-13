const mongoose = require('mongoose');
const Listing = require('./models/listing.js');

mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
  .then(async () => {
    console.log('Connected to DB');
    const listings = await Listing.find({});
    console.log('\n=== Total Listings:', listings.length, '===\n');
    
    listings.forEach((l, i) => {
      console.log(`${i+1}. Title: ${l.title}`);
      console.log(`   Country: "${l.country}"`);
      console.log(`   Location: ${l.location}`);
      console.log('');
    });
    
    mongoose.connection.close();
    console.log('Connection closed');
  })
  .catch(err => console.error('Error:', err));
