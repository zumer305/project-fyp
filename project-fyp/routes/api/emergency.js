const express = require("express");
const router = express.Router();
const emergencyController = require("../../controllers/api/emergencyController");

// Get emergency contacts for a specific country
router.get("/:country", emergencyController.getEmergencyContacts);

// Get all emergency contacts
router.get("/", emergencyController.getAllEmergencyContacts);

module.exports = router;
