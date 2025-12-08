const express = require("express");
const router = express.Router();
const TaxiBooking = require("../../models/taxiBooking.js");

// Get all bookings (for driver dashboard)
router.get("/", async (req, res) => {
  try {
    const bookings = await TaxiBooking.find()
      .sort({ createdAt: -1 })
      .populate("driver", "username");
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get pending bookings only
router.get("/pending", async (req, res) => {
  try {
    const bookings = await TaxiBooking.find({ status: "Pending" })
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new booking
router.post("/", async (req, res) => {
  try {
    const booking = new TaxiBooking(req.body);
    await booking.save();
    
    // Emit socket event to notify drivers
    req.app.get('io').emit('new-taxi-booking', booking);
    
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Accept booking (driver)
router.put("/:id/accept", async (req, res) => {
  try {
    const booking = await TaxiBooking.findByIdAndUpdate(
      req.params.id,
      { 
        status: "Accepted",
        acceptedAt: new Date(),
        driver: req.body.driverId || null
      },
      { new: true }
    );
    
    // Emit socket event
    req.app.get('io').emit('booking-accepted', booking);
    
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Complete booking
router.put("/:id/complete", async (req, res) => {
  try {
    const booking = await TaxiBooking.findByIdAndUpdate(
      req.params.id,
      { 
        status: "Completed",
        completedAt: new Date()
      },
      { new: true }
    );
    
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Cancel booking
router.put("/:id/cancel", async (req, res) => {
  try {
    const booking = await TaxiBooking.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true }
    );
    
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
