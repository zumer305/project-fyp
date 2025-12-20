#!/usr/bin/env node
/**
 * Verify TravelPackage data in MongoDB
 */

const mongoose = require("mongoose");
const TravelPackage = require("./models/travelPackage");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log(`Connected to ${MONGO_URL}\n`);

  const totalCount = await TravelPackage.countDocuments();
  console.log(`✓ Total packages: ${totalCount}\n`);

  const byCountry = await TravelPackage.aggregate([
    { $group: { _id: "$country", count: { $sum: 1 }, cities: { $addToSet: "$city" } } },
    { $sort: { _id: 1 } }
  ]);

  console.log("By Country:");
  byCountry.forEach(({ _id, count, cities }) => {
    console.log(`  ${_id}: ${count} packages across ${cities.length} cities`);
    console.log(`    Cities: ${cities.sort().join(", ")}`);
  });

  console.log("\nSample packages:");
  const samples = await TravelPackage.find().limit(3).lean();
  samples.forEach(pkg => {
    console.log(`  - ${pkg.city}, ${pkg.country} (${pkg.packageType}) - PKR ${pkg.total}`);
  });

  await mongoose.disconnect();
  console.log("\n✓ Verification complete!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
