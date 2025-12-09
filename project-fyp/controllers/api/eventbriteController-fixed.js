const axios = require("axios");

const EVENTBRITE_API_BASE = "https://www.eventbriteapi.com/v3";
const EVENTBRITE_TOKEN = process.env.EVENTBRITE_TOKEN;

/**
 * Search for events - This now redirects to the free events API
 * Since Eventbrite token doesn't have public search permission
 * GET /api/eventbrite/search
 */
exports.searchEvents = async (req, res) => {
  try {
    const { location = "Central Asia" } = req.query;

    // Note: The frontend now uses /api/events which has free public APIs
    // This endpoint is kept for backward compatibility
    
    res.json({
      success: true,
      count: 0,
      data: [],
      source: "Use /api/events for location-based event search",
      timestamp: new Date().toISOString(),
      message: `Please use /api/events?destination=${location} for real location-based events. Your Eventbrite token doesn't have public search permissions.`,
    });
  } catch (error) {
    console.error("Eventbrite API Error:", error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      message: "Error fetching events",
      error: error.message,
    });
  }
};

/**
 * Get user's organizations
 * GET /api/eventbrite/organizations
 */
exports.getOrganizations = async (req, res) => {
  try {
    const response = await axios.get(
      `${EVENTBRITE_API_BASE}/users/me/organizations/`,
      {
        headers: {
          Authorization: `Bearer ${EVENTBRITE_TOKEN}`,
        },
      }
    );

    res.json({
      success: true,
      data: response.data.organizations,
    });
  } catch (error) {
    console.error("Eventbrite API Error:", error.response?.data || error.message);
    
    res.status(error.response?.status || 500).json({
      success: false,
      message: "Error fetching organizations",
      error: error.response?.data?.error_description || error.message,
    });
  }
};

/**
 * Get user's events
 * GET /api/eventbrite/my-events
 */
exports.getMyEvents = async (req, res) => {
  try {
    const response = await axios.get(
      `${EVENTBRITE_API_BASE}/users/me/events/`,
      {
        headers: {
          Authorization: `Bearer ${EVENTBRITE_TOKEN}`,
        },
        params: {
          expand: "venue,organizer,category",
        },
      }
    );

    res.json({
      success: true,
      data: response.data.events,
    });
  } catch (error) {
    console.error("Eventbrite API Error:", error.response?.data || error.message);
    
    res.status(error.response?.status || 500).json({
      success: false,
      message: "Error fetching your events",
      error: error.response?.data?.error_description || error.message,
    });
  }
};

/**
 * Get categories
 * GET /api/eventbrite/categories
 */
exports.getCategories = async (req, res) => {
  try {
    const response = await axios.get(`${EVENTBRITE_API_BASE}/categories/`, {
      headers: {
        Authorization: `Bearer ${EVENTBRITE_TOKEN}`,
      },
    });

    res.json({
      success: true,
      data: response.data.categories,
    });
  } catch (error) {
    console.error("Eventbrite API Error:", error.response?.data || error.message);
    
    res.status(error.response?.status || 500).json({
      success: false,
      message: "Error fetching categories",
      error: error.response?.data?.error_description || error.message,
    });
  }
};

/**
 * Get specific event details
 * GET /api/eventbrite/event/:eventId
 */
exports.getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const response = await axios.get(
      `${EVENTBRITE_API_BASE}/events/${eventId}/`,
      {
        headers: {
          Authorization: `Bearer ${EVENTBRITE_TOKEN}`,
        },
        params: {
          expand: "venue,organizer,category,ticket_classes",
        },
      }
    );

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Eventbrite API Error:", error.response?.data || error.message);
    
    res.status(error.response?.status || 500).json({
      success: false,
      message: "Error fetching event details",
      error: error.response?.data?.error_description || error.message,
    });
  }
};
