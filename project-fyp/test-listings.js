const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const url = 'mongodb://127.0.0.1:27017/wanderlust';

async function main() {
    await mongoose.connect(url);
    console.log("Connected to MongoDB");
}

main()
    .then(async () => {
        const allListings = await Listing.find({});
        console.log(`Found ${allListings.length} listings in database:`);
        allListings.forEach((listing, index) => {
            console.log(`${index + 1}. ${listing.title} - ${listing.location}`);
        });
        mongoose.connection.close();
    })
    .catch((err) => {
        console.log("Error:", err);
        mongoose.connection.close();
    });
