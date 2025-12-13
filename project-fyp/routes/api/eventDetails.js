const express = require("express");
const router = express.Router();

// GET event details by ID (for external API events, not MongoDB listings)
router.get("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    // For external events, redirect to their URL
    // The eventId format tells us which source it's from
    if (eventId.startsWith('seatgeek-')) {
      // Extract SeatGeek ID and redirect
      const sgId = eventId.replace('seatgeek-', '');
      return res.redirect(`https://seatgeek.com/event/${sgId}`);
    }
    
    if (eventId.startsWith('osm-')) {
      // OpenStreetMap venue
      const osmId = eventId.replace('osm-', '');
      return res.redirect(`https://www.openstreetmap.org/node/${osmId}`);
    }

    // For Ticketmaster or other events with URLs
    return res.status(404).json({
      success: false,
      message: "Event details not found. Please use the event URL to view details.",
    });

  } catch (error) {
    console.error("Error fetching event details:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching event details",
      error: error.message,
    });
  }
});

module.exports = router;
