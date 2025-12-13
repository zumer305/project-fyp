// Quick test script for Eventbrite API integration
// Run this with: node test-eventbrite.js

require("dotenv").config();
const axios = require("axios");

const EVENTBRITE_API_BASE = "https://www.eventbriteapi.com/v3";
const EVENTBRITE_TOKEN = process.env.EVENTBRITE_TOKEN;

async function testEventbriteAPI() {
  console.log("🧪 Testing Eventbrite API Integration...\n");

  // Test 1: Verify token
  console.log("1️⃣ Testing API Token...");
  if (!EVENTBRITE_TOKEN) {
    console.error("❌ ERROR: EVENTBRITE_TOKEN not found in .env file!");
    return;
  }
  console.log("✅ Token found:", EVENTBRITE_TOKEN.substring(0, 10) + "...");

  // Test 2: Get user info
  console.log("\n2️⃣ Testing User Authentication...");
  try {
    const userResponse = await axios.get(`${EVENTBRITE_API_BASE}/users/me/`, {
      params: { token: EVENTBRITE_TOKEN },
    });
    console.log("✅ User authenticated:", userResponse.data.name);
    console.log("   Email:", userResponse.data.emails[0]?.email || "N/A");
  } catch (error) {
    console.error(
      "❌ Authentication failed:",
      error.response?.data?.error_description || error.message
    );
    console.log(
      "\n⚠️  Your token might be invalid. Please verify it at:"
    );
    console.log("   https://www.eventbrite.com/account-settings/apps");
    return;
  }

  // Test 3: Search events
  console.log("\n3️⃣ Testing Event Search...");
  try {
    const searchResponse = await axios.get(
      `${EVENTBRITE_API_BASE}/events/search/`,
      {
        params: {
          token: EVENTBRITE_TOKEN,
          "location.address": "New York, USA",
          "location.within": "50km",
          expand: "venue,organizer",
        },
      }
    );

    const events = searchResponse.data.events || [];
    console.log(`✅ Found ${events.length} events in New York`);

    if (events.length > 0) {
      console.log("\n📅 Sample Event:");
      const sampleEvent = events[0];
      console.log("   Name:", sampleEvent.name.text);
      console.log("   Date:", sampleEvent.start.local);
      console.log("   Venue:", sampleEvent.venue?.name || "Online");
      console.log("   URL:", sampleEvent.url);
    }
  } catch (error) {
    console.error(
      "❌ Event search failed:",
      error.response?.data?.error_description || error.message
    );
    return;
  }

  // Test 4: Get categories
  console.log("\n4️⃣ Testing Categories...");
  try {
    const categoriesResponse = await axios.get(
      `${EVENTBRITE_API_BASE}/categories/`,
      {
        params: { token: EVENTBRITE_TOKEN },
      }
    );

    const categories = categoriesResponse.data.categories || [];
    console.log(`✅ Found ${categories.length} event categories`);
    console.log(
      "   Examples:",
      categories.slice(0, 5).map((c) => c.name).join(", ")
    );
  } catch (error) {
    console.error(
      "❌ Categories fetch failed:",
      error.response?.data?.error_description || error.message
    );
  }

  console.log("\n✨ All tests completed!");
  console.log("\n🚀 Next Steps:");
  console.log("   1. Start your server: npm start");
  console.log("   2. Visit: http://localhost:8080/listings/eventbrite");
  console.log("   3. Search for events in any city!");
}

// Run the tests
testEventbriteAPI().catch((error) => {
  console.error("\n💥 Unexpected error:", error.message);
  process.exit(1);
});
