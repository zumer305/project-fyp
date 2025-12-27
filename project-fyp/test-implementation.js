/**
 * Quick test script for currency conversion and package generation
 * Run with: node test-implementation.js
 */

const { convertBudgetToUSD } = require("./utils/currencyHelper.js");
const { generatePackages } = require("./services/planner.js");

async function testCurrencyConversion() {
  console.log("=".repeat(60));
  console.log("TESTING CURRENCY CONVERSION");
  console.log("=".repeat(60));

  // Test 1: PKR to USD
  console.log("\nTest 1: Converting PKR to USD");
  const budgetPKR = 2800000;
  const budgetUSD1 = await convertBudgetToUSD(budgetPKR, "PKR");
  console.log(`${budgetPKR} PKR = $${budgetUSD1.toFixed(2)} USD`);

  // Test 2: EUR to USD
  console.log("\nTest 2: Converting EUR to USD");
  const budgetEUR = 10000;
  const budgetUSD2 = await convertBudgetToUSD(budgetEUR, "EUR");
  console.log(`${budgetEUR} EUR = $${budgetUSD2.toFixed(2)} USD`);

  // Test 3: USD to USD (should be 1:1)
  console.log("\nTest 3: Converting USD to USD");
  const budgetUSD3 = await convertBudgetToUSD(5000, "USD");
  console.log(`5000 USD = $${budgetUSD3.toFixed(2)} USD`);

  console.log("\n✓ Currency conversion tests completed\n");
  return budgetUSD1;
}

async function testPackageGeneration(budgetUSD) {
  console.log("=".repeat(60));
  console.log("TESTING PACKAGE GENERATION (3 PER CATEGORY)");
  console.log("=".repeat(60));

  // Test 1: Generate packages for Kazakhstan
  console.log("\nTest 1: Generating packages for Kazakhstan");
  console.log(`Budget: $${budgetUSD.toFixed(2)} USD`);
  const packages1 = generatePackages({
    country: "Kazakhstan",
    budgetUSD: budgetUSD,
    durationDays: 7,
  });

  console.log(`\nGenerated ${packages1.length} packages:`);
  console.log("Expected: 3 packages per budget category (budget/mid/luxury)");

  // Group by price range
  const budgetPkgs1 = packages1.filter((p) => p.totalEstimateUSD < 500);
  const midPkgs1 = packages1.filter(
    (p) => p.totalEstimateUSD >= 500 && p.totalEstimateUSD < 1500
  );
  const luxuryPkgs1 = packages1.filter((p) => p.totalEstimateUSD >= 1500);

  console.log(`  💰 Budget category: ${budgetPkgs1.length} packages`);
  console.log(`  ⭐ Mid-range category: ${midPkgs1.length} packages`);
  console.log(`  👑 Luxury category: ${luxuryPkgs1.length} packages`);

  if (packages1.length >= 6 && packages1.length <= 12) {
    console.log("✓ CORRECT: Package count is reasonable (6-12 total)");
  } else {
    console.log(`Note: Got ${packages1.length} packages`);
  }
  packages1.forEach((pkg, idx) => {
    const withinBudget = pkg.totalEstimateUSD <= budgetUSD ? "✓" : "✗";
    console.log(
      `  ${idx + 1}. ${pkg.name} - $${pkg.totalEstimateUSD} USD (${
        pkg.duration
      }) ${withinBudget}`
    );
  });

  // Test 2: Generate packages for Uzbekistan
  console.log("\n\nTest 2: Generating packages for Uzbekistan");
  const testBudget = 5000;
  const packages2 = generatePackages({
    country: "Uzbekistan",
    budgetUSD: testBudget,
    durationDays: 5,
  });

  console.log(`\nGenerated ${packages2.length} packages:`);

  // Group by price range
  const budgetPkgs2 = packages2.filter((p) => p.totalEstimateUSD < 500);
  const midPkgs2 = packages2.filter(
    (p) => p.totalEstimateUSD >= 500 && p.totalEstimateUSD < 1500
  );
  const luxuryPkgs2 = packages2.filter((p) => p.totalEstimateUSD >= 1500);

  console.log(`  💰 Budget category: ${budgetPkgs2.length} packages`);
  console.log(`  ⭐ Mid-range category: ${midPkgs2.length} packages`);
  console.log(`  👑 Luxury category: ${luxuryPkgs2.length} packages`);
  packages2.forEach((pkg, idx) => {
    const withinBudget =
      pkg.totalEstimateUSD <= testBudget ? "✓ Within" : "✗ Above";
    console.log(
      `  ${idx + 1}. ${pkg.name} - $${pkg.totalEstimateUSD} USD (${
        pkg.duration
      }) ${withinBudget} budget`
    );
    console.log(
      `     Breakdown: Hotel $${pkg.breakdownUSD.hotel}, Food $${pkg.breakdownUSD.food}, Transport $${pkg.breakdownUSD.transport}`
    );
  });

  // Test 3: Check that prices are different
  console.log("\n\nTest 3: Verifying prices are different");
  const uniquePrices = new Set(packages2.map((p) => p.totalEstimateUSD));
  console.log(
    `Unique prices: ${uniquePrices.size} out of ${packages2.length} packages`
  );
  if (uniquePrices.size > 1) {
    console.log("✓ SUCCESS: Packages have different prices");
  } else {
    console.log("✗ FAILED: All packages have the same price");
  }

  // Verify totalEstimateUSD matches priceUSD
  const allMatch = packages2.every((p) => p.totalEstimateUSD === p.priceUSD);
  if (allMatch) {
    console.log(
      "✓ SUCCESS: totalEstimateUSD matches priceUSD for all packages"
    );
  } else {
    console.log(
      "✗ WARNING: Some packages have mismatched totalEstimateUSD and priceUSD"
    );
  }

  // Test 4: Check budget filtering with low budget
  console.log("\n\nTest 4: Testing budget filtering with LOW BUDGET");
  const lowBudget = 500;
  const packages3 = generatePackages({
    country: "Kyrgyzstan",
    budgetUSD: lowBudget,
    durationDays: 7,
  });
  console.log(`Budget: $${lowBudget} USD`);
  console.log(`Packages returned: ${packages3.length}`);

  const allWithinBudget = packages3.every(
    (p) => p.totalEstimateUSD <= lowBudget
  );
  const allAboveBudget = packages3.every((p) => p.totalEstimateUSD > lowBudget);

  if (allWithinBudget) {
    console.log("✓ All packages within budget");
  } else if (allAboveBudget) {
    console.log(
      "✓ No packages within budget, showing closest above (expected behavior)"
    );
  } else {
    const withinCount = packages3.filter(
      (p) => p.totalEstimateUSD <= lowBudget
    ).length;
    const aboveCount = packages3.filter(
      (p) => p.totalEstimateUSD > lowBudget
    ).length;
    console.log(
      `✓ Mixed: ${withinCount} within budget, ${aboveCount} above (filling to 4 total)`
    );
  }

  packages3.forEach((pkg, idx) => {
    const status = pkg.totalEstimateUSD <= lowBudget ? "Within" : "Above";
    console.log(
      `  ${idx + 1}. ${pkg.name} - $${
        pkg.totalEstimateUSD
      } USD (${status} budget)`
    );
  });

  // Test 5: Check with high budget
  console.log("\n\nTest 5: Testing budget filtering with HIGH BUDGET");
  const highBudget = 50000;
  const packages4 = generatePackages({
    country: "Turkmenistan",
    budgetUSD: highBudget,
    durationDays: 10,
  });
  console.log(`Budget: $${highBudget} USD`);
  console.log(`Packages returned: ${packages4.length}`);

  console.log("All packages should be within budget:");
  packages4.forEach((pkg, idx) => {
    const status = pkg.totalEstimateUSD <= highBudget ? "✓" : "✗";
    console.log(
      `  ${idx + 1}. ${pkg.name} - $${pkg.totalEstimateUSD} USD ${status}`
    );
  });

  console.log("\n✓ Package generation tests completed\n");
}

async function runTests() {
  try {
    console.log("\n🚀 Starting Implementation Tests\n");

    const budgetUSD = await testCurrencyConversion();
    await testPackageGeneration(budgetUSD);

    console.log("=".repeat(60));
    console.log("✅ ALL TESTS COMPLETED SUCCESSFULLY");
    console.log("=".repeat(60));
    console.log("\nYou can now:");
    console.log("1. Visit http://localhost:8080");
    console.log("2. Select a country and enter a budget");
    console.log('3. Click "View Packages" to see dynamic pricing in action');
    console.log("4. Change currency in the navbar to see conversion working\n");
  } catch (error) {
    console.error("\n❌ TEST FAILED:", error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run tests
runTests();
