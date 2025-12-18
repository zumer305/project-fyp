/**
 * Test script to verify booking creation functionality
 * Run with: node test-booking-creation.js
 */

const mongoose = require("mongoose");
const Booking = require("./models/booking");
const User = require("./models/user");

// Load environment variables
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const MONGO_URL =
  process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function testBookingCreation() {
  try {
    // Connect to database
    console.log("🔌 Connecting to database...");
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to database");

    // Find or create a test user
    console.log("\n👤 Finding test user...");
    let testUser = await User.findOne({ email: "test@example.com" });
    
    if (!testUser) {
      console.log("Creating test user...");
      testUser = new User({
        username: "testuser",
        email: "test@example.com",
      });
      await testUser.setPassword("test123");
      await testUser.save();
      console.log("✅ Test user created");
    } else {
      console.log("✅ Test user found:", testUser.username);
    }

    // Create a test booking
    console.log("\n📝 Creating test booking...");
    const testBooking = new Booking({
      user: testUser._id,
      packageDetails: {
        packageId: "test-pkg-001",
        packageTitle: "Test Package - Maldives",
        destination: "Maldives",
        country: "Maldives",
        duration: "7 Days / 6 Nights",
        totalCost: 2500,
        currency: "USD",
        fullPackage: {
          packageTitle: "Test Package - Maldives",
          destination: "Maldives",
          totalCost: 2500,
          currency: "USD",
        },
      },
      travelDates: {
        startDate: new Date("2025-12-25"),
        endDate: new Date("2025-12-31"),
      },
      travelers: {
        adults: 2,
        children: 1,
      },
      contactInfo: {
        fullName: "Test User",
        email: "test@example.com",
        phone: "+1234567890",
        specialRequests: "This is a test booking",
      },
      totalPrice: 6750, // 2*2500 + 1*2500*0.7
      status: "pending",
    });

    await testBooking.save();
    console.log("✅ Test booking created successfully!");
    console.log("📌 Booking Reference:", testBooking.bookingReference);
    console.log("🆔 Booking ID:", testBooking._id);
    console.log("💰 Total Price:", testBooking.totalPrice, testBooking.packageDetails.currency);
    console.log("📅 Travel Dates:", testBooking.travelDates.startDate.toDateString(), "to", testBooking.travelDates.endDate.toDateString());
    console.log("👥 Travelers:", testBooking.travelers.adults, "adults,", testBooking.travelers.children, "children");

    // Verify the booking can be retrieved
    console.log("\n🔍 Verifying booking retrieval...");
    const retrievedBooking = await Booking.findById(testBooking._id).populate("user");
    
    if (retrievedBooking) {
      console.log("✅ Booking retrieved successfully!");
      console.log("📌 Retrieved Reference:", retrievedBooking.bookingReference);
      console.log("👤 User:", retrievedBooking.user.username);
    } else {
      console.log("❌ Failed to retrieve booking");
    }

    // List all bookings
    console.log("\n📋 Listing all bookings...");
    const allBookings = await Booking.find().limit(5);
    console.log(`Found ${allBookings.length} booking(s)`);
    allBookings.forEach((b, index) => {
      console.log(`  ${index + 1}. ${b.bookingReference} - ${b.packageDetails.packageTitle} (${b.status})`);
    });

    console.log("\n✅ All tests completed successfully!");
    console.log("\n💡 Booking system is working correctly!");

  } catch (error) {
    console.error("\n❌ Test failed with error:");
    console.error(error);
    if (error.errors) {
      console.error("\nValidation errors:");
      Object.keys(error.errors).forEach(key => {
        console.error(`  - ${key}: ${error.errors[key].message}`);
      });
    }
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
}

// Run the test
console.log("🧪 Starting Booking Creation Test\n");
testBookingCreation();
