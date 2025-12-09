// Script to seed taxi fares data into MongoDB
const mongoose = require("mongoose");
const TaxiFare = require("../models/TaxiFare");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.log("❌ MongoDB connection error:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const taxiFaresData = [
  {
    name: "Suzuki Cultus",
    type: "Standard",
    capacity: "4 passengers",
    baseFare: 1.0,
    perKm: 0.4,
    imageUrl:
      "https://suzukipakistan.com/Media/Used-Cars/Product/15814073203.jpg",
    emoji: "🚗",
    features: [
      "Air Conditioning",
      "Clean & Comfortable",
      "Local Driver",
      "Affordable",
    ],
    region: "Central Asia",
  },
  {
    name: "Suzuki WagonR",
    type: "Economy",
    capacity: "4 passengers",
    baseFare: 1.2,
    perKm: 0.45,
    imageUrl:
      "https://www.autosbangla.com/images/suzuki/suzuki-wagon-r-img1.jpg",
    emoji: "🚙",
    features: [
      "Spacious",
      "Fuel Efficient",
      "Local Favorite",
      "Air Conditioning",
    ],
    region: "Central Asia",
  },
  {
    name: "Toyota Corolla",
    type: "Comfort",
    capacity: "4 passengers",
    baseFare: 1.5,
    perKm: 0.6,
    imageUrl:
      "https://editorial.pxcrush.net/carsales/general/editorial/corolla-sedan-4.jpg?width=1024&height=682",
    emoji: "🚘",
    features: [
      "Comfortable Ride",
      "Air Conditioning",
      "Reliable",
      "Professional Service",
    ],
    region: "Central Asia",
  },
  {
    name: "Daewoo Nexia",
    type: "Budget",
    capacity: "4 passengers",
    baseFare: 0.9,
    perKm: 0.35,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/56/Daewoo_Nexia_2013.JPG",
    emoji: "🚗",
    features: [
      "Budget Friendly",
      "Popular in Central Asia",
      "Basic Comfort",
      "Easy to Find",
    ],
    region: "Central Asia",
  },
  {
    name: "Chevrolet Spark",
    type: "Mini",
    capacity: "3 passengers",
    baseFare: 0.8,
    perKm: 0.3,
    imageUrl:
      "https://hips.hearstapps.com/hmg-prod/images/2022-chevrolet-spark-mmp-1-1638552174.jpg?crop=0.997xw:0.751xh;0,0.138xh&resize=1200:*",
    emoji: "🚕",
    features: [
      "Very Affordable",
      "Perfect for Solo/Couple",
      "Compact",
      "City Travel",
    ],
    region: "Central Asia",
  },
  {
    name: "Hyundai Accent",
    type: "Standard",
    capacity: "4 passengers",
    baseFare: 1.3,
    perKm: 0.5,
    imageUrl:
      "https://hips.hearstapps.com/hmg-prod/images/2022-hyundai-accent-mmp-1-1634756931.jpg",
    emoji: "🚘",
    features: [
      "Good Comfort",
      "Air Conditioning",
      "Smooth Ride",
      "Popular Choice",
    ],
    region: "Central Asia",
  },
  {
    name: "Lada (Local)",
    type: "Budget",
    capacity: "4 passengers",
    baseFare: 0.7,
    perKm: 0.3,
    imageUrl:
      "https://www.shutterstock.com/image-photo/tyumen-city-russia-june-11-260nw-1779162413.jpg",
    emoji: "🚙",
    features: [
      "Cheapest Option",
      "Traditional",
      "Basic Transport",
      "Widely Available",
    ],
    region: "Central Asia",
  },
  {
    name: "Nissan Tiida",
    type: "Comfort",
    capacity: "4 passengers",
    baseFare: 1.4,
    perKm: 0.55,
    imageUrl:
      "https://perfectcars.ae/wp-content/uploads/2024/04/2994afe2-b6f3-4cbd-b29f-6104c2ebd2ca.jpg",
    emoji: "🚗",
    features: [
      "Comfortable Interior",
      "Air Conditioning",
      "Good for Long Trips",
      "Reliable",
    ],
    region: "Central Asia",
  },
  {
    name: "Shared Marshrutka",
    type: "Shared",
    capacity: "12-15 passengers",
    baseFare: 0.3,
    perKm: 0.1,
    imageUrl: "https://katieaune.com/wp-content/uploads/2013/05/SAM_1790.jpg",
    emoji: "🚐",
    features: [
      "Most Affordable",
      "Share with Others",
      "Local Experience",
      "Fixed Routes",
    ],
    region: "Central Asia",
  },
];

const initDB = async () => {
  try {
    // Clear existing data
    await TaxiFare.deleteMany({});
    console.log("🗑️  Cleared existing taxi fares");

    // Insert new data
    const result = await TaxiFare.insertMany(taxiFaresData);
    console.log(`✅ Successfully inserted ${result.length} taxi fares`);

    console.log("\n📊 Inserted Fares:");
    result.forEach((fare, index) => {
      console.log(
        `${index + 1}. ${fare.name} - $${fare.baseFare} + $${fare.perKm}/km`
      );
    });

    mongoose.connection.close();
    console.log("\n✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    mongoose.connection.close();
  }
};

initDB();
