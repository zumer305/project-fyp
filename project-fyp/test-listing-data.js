// Test if data loads properly
console.log("Testing data loading...\n");

try {
  const initData = require("./init/data.js");
  console.log("✓ Data loaded successfully!");
  console.log(`Total listings: ${initData.data.length}\n`);
  
  // Show first 5 listings
  for (let i = 0; i < Math.min(5, initData.data.length); i++) {
    const listing = initData.data[i];
    console.log(`${i + 1}. ${listing.title}`);
    console.log(`   Price: ₹${listing.price}`);
    console.log(`   Location: ${listing.location}`);
    console.log(`   Image URL: ${listing.image?.url ? "✓ Present" : "✗ Missing"}\n`);
  }
  
  console.log("✓ Data is ready to display!");
} catch (error) {
  console.error("✗ Error loading data:", error.message);
}
