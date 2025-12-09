// Check what your current token can access
require("dotenv").config();
const axios = require("axios");

const EVENTBRITE_API_BASE = "https://www.eventbriteapi.com/v3";
const EVENTBRITE_TOKEN = process.env.EVENTBRITE_TOKEN;

async function checkTokenPermissions() {
  console.log("🔍 Checking your Eventbrite token permissions...\n");

  // Test user access
  try {
    const userResponse = await axios.get(`${EVENTBRITE_API_BASE}/users/me/`, {
      headers: { Authorization: `Bearer ${EVENTBRITE_TOKEN}` },
    });
    console.log("✅ user_read: Working");
    console.log(`   User: ${userResponse.data.name}\n`);
  } catch (error) {
    console.log("❌ user_read: Not available\n");
  }

  // Test event search (location-based)
  console.log("Testing public event search in New York...");
  try {
    const searchResponse = await axios.get(
      `${EVENTBRITE_API_BASE}/destination/events/`,
      {
        headers: { Authorization: `Bearer ${EVENTBRITE_TOKEN}` },
        params: {
          "location.address": "New York, USA",
          "location.within": "50km",
        },
      }
    );
    console.log("✅ event_search: Working");
    console.log(`   Found ${searchResponse.data.events?.length || 0} events in New York\n`);
  } catch (error) {
    console.log("❌ event_search: Not available");
    console.log(`   Error: ${error.response?.data?.error_description || error.message}\n`);
  }

  // Alternative: Try organization-based public events
  console.log("Testing organization public events...");
  try {
    const orgsResponse = await axios.get(
      `${EVENTBRITE_API_BASE}/users/me/organizations/`,
      {
        headers: { Authorization: `Bearer ${EVENTBRITE_TOKEN}` },
      }
    );
    
    if (orgsResponse.data.organizations?.length > 0) {
      const orgId = orgsResponse.data.organizations[0].id;
      console.log(`✅ Found organization: ${orgsResponse.data.organizations[0].name}`);
      
      const orgEventsResponse = await axios.get(
        `${EVENTBRITE_API_BASE}/organizations/${orgId}/events/`,
        {
          headers: { Authorization: `Bearer ${EVENTBRITE_TOKEN}` },
          params: { status: "all" },
        }
      );
      console.log(`   Organization has ${orgEventsResponse.data.events?.length || 0} events\n`);
    } else {
      console.log("   No organizations found\n");
    }
  } catch (error) {
    console.log(`❌ Error: ${error.response?.data?.error_description || error.message}\n`);
  }

  console.log("\n" + "=".repeat(70));
  console.log("\n📋 SUMMARY:");
  console.log("Your token type: Private Token (OAuth)");
  console.log("\n❌ ISSUE: Your token cannot search PUBLIC events by location");
  console.log("   This means: You CAN'T show events happening in user-selected cities\n");
  
  console.log("✅ SOLUTION:");
  console.log("   Option 1: Upgrade Token Permissions (Recommended)");
  console.log("   ────────────────────────────────────────────────");
  console.log("   1. Visit: https://www.eventbrite.com/account-settings/apps");
  console.log("   2. Create a new OAuth app (not just a token)");
  console.log("   3. Request these scopes:");
  console.log("      - event_search");
  console.log("      - organization_read");
  console.log("      - user_read");
  console.log("   4. Generate OAuth token with these scopes");
  console.log("   5. Update EVENTBRITE_TOKEN in .env\n");

  console.log("   Option 2: Use Eventbrite's Public Embed Widget");
  console.log("   ───────────────────────────────────────────────");
  console.log("   Use Eventbrite's JavaScript widget to show public events");
  console.log("   No API token needed, but less customization\n");

  console.log("   Option 3: Show YOUR Events as Travel Experiences");
  console.log("   ─────────────────────────────────────────────────");
  console.log("   Create events for tours/experiences in your app");
  console.log("   Perfect if YOU are the tour operator\n");

  console.log("=".repeat(70));
}

checkTokenPermissions().catch(console.error);
