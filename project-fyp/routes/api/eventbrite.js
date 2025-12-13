const express = require("express");
const router = express.Router();
const eventbriteController = require("../../controllers/api/eventbriteController");

// Search events by location
router.get("/search", eventbriteController.searchEvents);

// Get user's organizations
router.get("/organizations", eventbriteController.getOrganizations);

// Get user's events
router.get("/my-events", eventbriteController.getMyEvents);

// Get event categories
router.get("/categories", eventbriteController.getCategories);

// Get specific event details
router.get("/event/:eventId", eventbriteController.getEventById);

module.exports = router;
