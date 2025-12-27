/**
 * Test Realistic Pricing Implementation
 * Tests that all packages meet minimum PKR 500,000 requirement
 */

const path = require("path");

// Mock the dataset path for planner
process.env.NODE_ENV = "test";

const {
  calculatePackagePrice,
  isPriceRealistic,
  getPKRPerUSD,
  MIN_PKR_THRESHOLD,
} = require("./services/pricing.js");
const { generatePackages } = require("./services/planner.js");

async function runTests() {
  console.log("=".repeat(60));
  console.log("REALISTIC PRICING IMPLEMENTATION TEST");
  console.log("=".repeat(60));
  console.log();

  // Test 1: PKR Exchange Rate
  console.log("📊 Test 1: PKR Exchange Rate");
  console.log("-".repeat(60));
  try {
    const pkrRate = await getPKRPerUSD();
    console.log(`✓ 1 USD = ${pkrRate.toFixed(2)} PKR`);
    console.log(
      `✓ Minimum package price: ${(MIN_PKR_THRESHOLD / pkrRate).toFixed(2)} USD`
    );
    console.log();
  } catch (error) {
    console.error("✗ Failed to get PKR rate:", error.message);
    console.log();
  }

  // Test 2: Budget Tier Pricing
  console.log("📊 Test 2: Budget Tier Pricing (5 days in Kazakhstan)");
  console.log("-".repeat(60));
  try {
    const budgetPkg = await calculatePackagePrice(
      "Kazakhstan",
      "budget",
      5,
      "test_budget_1"
    );
    const midPkg = await calculatePackagePrice(
      "Kazakhstan",
      "mid",
      5,
      "test_mid_1"
    );
    const luxuryPkg = await calculatePackagePrice(
      "Kazakhstan",
      "luxury",
      5,
      "test_luxury_1"
    );

    console.log(
      `Budget Package:  ${budgetPkg.priceUSD.toLocaleString()} USD (${budgetPkg.pricePKR.toLocaleString()} PKR)`
    );
    console.log(
      `  - Realistic? ${
        isPriceRealistic(budgetPkg.priceUSD) ? "✓ YES" : "✗ NO (too low!)"
      }`
    );
    console.log(
      `  - Breakdown: Hotel $${budgetPkg.breakdownUSD.hotel}, Food $${budgetPkg.breakdownUSD.food}, Transport $${budgetPkg.breakdownUSD.transport}, Activities $${budgetPkg.breakdownUSD.activities}`
    );
    console.log();

    console.log(
      `Mid Package:     ${midPkg.priceUSD.toLocaleString()} USD (${midPkg.pricePKR.toLocaleString()} PKR)`
    );
    console.log(
      `  - Realistic? ${
        isPriceRealistic(midPkg.priceUSD) ? "✓ YES" : "✗ NO (too low!)"
      }`
    );
    console.log(
      `  - Breakdown: Hotel $${midPkg.breakdownUSD.hotel}, Food $${midPkg.breakdownUSD.food}, Transport $${midPkg.breakdownUSD.transport}, Activities $${midPkg.breakdownUSD.activities}`
    );
    console.log();

    console.log(
      `Luxury Package:  ${luxuryPkg.priceUSD.toLocaleString()} USD (${luxuryPkg.pricePKR.toLocaleString()} PKR)`
    );
    console.log(
      `  - Realistic? ${
        isPriceRealistic(luxuryPkg.priceUSD) ? "✓ YES" : "✗ NO (too low!)"
      }`
    );
    console.log(
      `  - Breakdown: Hotel $${luxuryPkg.breakdownUSD.hotel}, Food $${luxuryPkg.breakdownUSD.food}, Transport $${luxuryPkg.breakdownUSD.transport}, Activities $${luxuryPkg.breakdownUSD.activities}`
    );
    console.log();
  } catch (error) {
    console.error("✗ Failed tier pricing test:", error.message);
    console.log();
  }

  // Test 3: Country Multipliers
  console.log("📊 Test 3: Country Multipliers (Budget, 5 days)");
  console.log("-".repeat(60));
  try {
    const countries = [
      "Kazakhstan",
      "Uzbekistan",
      "Kyrgyzstan",
      "Tajikistan",
      "Turkmenistan",
      "Azerbaijan",
    ];

    for (const country of countries) {
      const pkg = await calculatePackagePrice(
        country,
        "budget",
        5,
        `test_${country}`
      );
      const realistic = isPriceRealistic(pkg.priceUSD);
      console.log(
        `${country.padEnd(15)} | ${pkg.priceUSD
          .toLocaleString()
          .padStart(6)} USD | ${pkg.pricePKR
          .toLocaleString()
          .padStart(10)} PKR | ${realistic ? "✓" : "✗"}`
      );
    }
    console.log();
  } catch (error) {
    console.error("✗ Failed country test:", error.message);
    console.log();
  }

  // Test 4: Stable Jitter
  console.log("📊 Test 4: Stable Jitter (Same ID = Same Price)");
  console.log("-".repeat(60));
  try {
    const pkg1a = await calculatePackagePrice(
      "Kazakhstan",
      "budget",
      5,
      "Kazakhstan_Almaty_test_jitter_123",
      "Almaty"
    );
    const pkg1b = await calculatePackagePrice(
      "Kazakhstan",
      "budget",
      5,
      "Kazakhstan_Almaty_test_jitter_123",
      "Almaty"
    );
    const pkg2 = await calculatePackagePrice(
      "Kazakhstan",
      "budget",
      5,
      "Kazakhstan_Astana_test_jitter_456",
      "Astana"
    );

    console.log(`Package test_jitter_123 (call 1): ${pkg1a.priceUSD} USD`);
    console.log(`Package test_jitter_123 (call 2): ${pkg1b.priceUSD} USD`);
    console.log(
      `Match? ${
        pkg1a.priceUSD === pkg1b.priceUSD
          ? "✓ YES (stable)"
          : "✗ NO (unstable!)"
      }`
    );
    console.log();
    console.log(`Package test_jitter_456 (Astana): ${pkg2.priceUSD} USD`);
    console.log(
      `Different? ${
        pkg1a.priceUSD !== pkg2.priceUSD
          ? "✓ YES (jitter working)"
          : "✗ NO (no variation!)"
      }`
    );
    console.log();
  } catch (error) {
    console.error("✗ Failed jitter test:", error.message);
    console.log();
  }

  // Test 5: Generate Packages (Max 4)
  console.log("📊 Test 5: Package Generation (Budget Filter - Max 4)");
  console.log("-".repeat(60));
  try {
    // Test with 10,000 USD budget (~2.78M PKR)
    const packages = await generatePackages({
      country: "Kazakhstan",
      budgetUSD: 10000,
      durationDays: 5,
    });

    console.log(`Generated ${packages.length} packages (should be max 4)`);
    console.log(
      `Count check: ${packages.length <= 4 ? "✓ PASS" : "✗ FAIL (too many!)"}`
    );
    console.log();

    packages.forEach((pkg, idx) => {
      const realistic = isPriceRealistic(pkg.priceUSD);
      const withinBudget = pkg.totalEstimateUSD <= 10000;
      console.log(`${idx + 1}. ${pkg.name}`);
      console.log(`   Price: ${pkg.priceUSD.toLocaleString()} USD`);
      console.log(
        `   Realistic? ${realistic ? "✓" : "✗"} | Within budget? ${
          withinBudget ? "✓" : "⚠️ (fill above budget)"
        }`
      );
      console.log(
        `   Breakdown: H:$${pkg.breakdownUSD.hotel} F:$${pkg.breakdownUSD.food} T:$${pkg.breakdownUSD.transport} A:$${pkg.breakdownUSD.activities}`
      );
      console.log();
    });
  } catch (error) {
    console.error("✗ Failed package generation test:", error);
    console.log();
  }

  // Test 6: Low Budget Scenario
  console.log("📊 Test 6: Low Budget Scenario (3000 USD / ~834K PKR)");
  console.log("-".repeat(60));
  try {
    const packages = await generatePackages({
      country: "Kyrgyzstan",
      budgetUSD: 3000,
      durationDays: 5,
    });

    console.log(`Generated ${packages.length} packages`);

    if (packages.length === 0) {
      console.log(
        "⚠️  No packages found - should return cheapest options as fallback"
      );
    } else {
      const allWithinOrNear = packages.every((p) => p.totalEstimateUSD <= 3500);
      console.log(
        `Budget adherence: ${
          allWithinOrNear ? "✓ PASS" : "⚠️ Some far above budget"
        }`
      );

      packages.forEach((pkg, idx) => {
        console.log(
          `${idx + 1}. ${pkg.name}: $${pkg.priceUSD.toLocaleString()} USD`
        );
      });
    }
    console.log();
  } catch (error) {
    console.error("✗ Failed low budget test:", error);
    console.log();
  }

  // Test 7: All Packages Meet Minimum
  console.log(
    `📊 Test 7: Verify All Generated Packages Meet PKR ${MIN_PKR_THRESHOLD.toLocaleString()} Minimum`
  );
  console.log("-".repeat(60));
  try {
    const countries = ["Kazakhstan", "Uzbekistan", "Kyrgyzstan"];
    let totalPackages = 0;
    let realisticPackages = 0;

    for (const country of countries) {
      const packages = await generatePackages({
        country,
        budgetUSD: 50000, // High budget to get all tiers
        durationDays: 5,
      });

      packages.forEach((pkg) => {
        totalPackages++;
        if (isPriceRealistic(pkg.priceUSD)) {
          realisticPackages++;
        } else {
          console.log(
            `⚠️  ${country} - ${pkg.name}: ${pkg.priceUSD} USD is too low!`
          );
        }
      });
    }

    console.log(`Total packages tested: ${totalPackages}`);
    console.log(`Realistic packages: ${realisticPackages}`);
    console.log(
      `Success rate: ${((realisticPackages / totalPackages) * 100).toFixed(1)}%`
    );
    console.log(
      `Result: ${
        realisticPackages === totalPackages
          ? "✓ ALL PACKAGES REALISTIC"
          : "✗ SOME PACKAGES TOO LOW"
      }`
    );
    console.log();
  } catch (error) {
    console.error("✗ Failed minimum price test:", error);
    console.log();
  }

  console.log("=".repeat(60));
  console.log("TESTS COMPLETED");
  console.log("=".repeat(60));
}

// Run tests
runTests().catch(console.error);
