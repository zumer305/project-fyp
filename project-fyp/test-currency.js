/**
 * Test file for Currency Conversion API
 * Run this file with: node test-currency.js
 */

const axios = require("axios");

const API_KEY = "f89564ac56157b052d3e78a6976e155e";
const BASE_URL = "https://api.exchangerate.host";

async function testCurrencyAPI() {
  console.log("🧪 Testing Currency Conversion API\n");
  console.log("=" .repeat(50));

  // Test 1: Get supported currencies
  console.log("\n📋 Test 1: Get Supported Currencies");
  try {
    const response = await axios.get(`${BASE_URL}/symbols`, {
      params: { access_key: API_KEY },
      timeout: 5000,
    });

    if (response.data && response.data.success) {
      const currencies = Object.keys(response.data.symbols);
      console.log(`✅ Success! Found ${currencies.length} currencies`);
      console.log(
        "Sample currencies:",
        currencies.slice(0, 10).join(", "),
        "..."
      );
    } else {
      console.log("❌ Failed:", response.data);
    }
  } catch (error) {
    console.log("❌ Error:", error.message);
  }

  // Test 2: Get latest exchange rates
  console.log("\n💱 Test 2: Get Latest Exchange Rates (USD base)");
  try {
    const response = await axios.get(`${BASE_URL}/latest`, {
      params: {
        access_key: API_KEY,
        base: "USD",
        symbols: "PKR,EUR,GBP,INR,UZS",
      },
      timeout: 5000,
    });

    if (response.data && response.data.success) {
      console.log("✅ Success! Latest rates:");
      console.log(`   Base: ${response.data.base}`);
      console.log(`   Date: ${response.data.date}`);
      Object.entries(response.data.rates).forEach(([currency, rate]) => {
        console.log(`   1 USD = ${rate} ${currency}`);
      });
    } else {
      console.log("❌ Failed:", response.data);
    }
  } catch (error) {
    console.log("❌ Error:", error.message);
  }

  // Test 3: Convert currency
  console.log("\n💰 Test 3: Convert 100 USD to PKR");
  try {
    const response = await axios.get(`${BASE_URL}/convert`, {
      params: {
        access_key: API_KEY,
        from: "USD",
        to: "PKR",
        amount: 100,
      },
      timeout: 5000,
    });

    if (response.data && response.data.success) {
      console.log("✅ Success!");
      console.log(`   ${response.data.query.amount} ${response.data.query.from}`);
      console.log(`   = ${response.data.result} ${response.data.query.to}`);
      console.log(`   Rate: ${response.data.info.rate}`);
      console.log(`   Date: ${response.data.date}`);
    } else {
      console.log("❌ Failed:", response.data);
    }
  } catch (error) {
    console.log("❌ Error:", error.message);
  }

  // Test 4: Convert multiple amounts
  console.log("\n🔄 Test 4: Multiple Conversions");
  const conversions = [
    { amount: 50, from: "USD", to: "EUR" },
    { amount: 1000, from: "USD", to: "UZS" },
    { amount: 200, from: "USD", to: "KZT" },
  ];

  for (const conv of conversions) {
    try {
      const response = await axios.get(`${BASE_URL}/convert`, {
        params: {
          access_key: API_KEY,
          ...conv,
        },
        timeout: 5000,
      });

      if (response.data && response.data.success) {
        console.log(
          `✅ ${conv.amount} ${conv.from} = ${response.data.result.toFixed(
            2
          )} ${conv.to}`
        );
      }
    } catch (error) {
      console.log(`❌ ${conv.from} to ${conv.to}: ${error.message}`);
    }
  }

  // Test 5: Historical rates (example)
  console.log("\n📅 Test 5: Historical Rates (2024-01-01)");
  try {
    const response = await axios.get(`${BASE_URL}/2024-01-01`, {
      params: {
        access_key: API_KEY,
        base: "USD",
        symbols: "PKR,EUR",
      },
      timeout: 5000,
    });

    if (response.data && response.data.success) {
      console.log("✅ Success! Historical rates:");
      console.log(`   Date: ${response.data.date}`);
      Object.entries(response.data.rates).forEach(([currency, rate]) => {
        console.log(`   1 USD = ${rate} ${currency}`);
      });
    } else {
      console.log("❌ Failed:", response.data);
    }
  } catch (error) {
    console.log("❌ Error:", error.message);
  }

  console.log("\n" + "=".repeat(50));
  console.log("🎉 Currency API Testing Complete!\n");
}

// Run tests
testCurrencyAPI().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
