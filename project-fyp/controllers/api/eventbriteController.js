const axios = require("axios");

const EVENTBRITE_API_BASE = "https://www.eventbriteapi.com/v3";
const EVENTBRITE_TOKEN = process.env.EVENTBRITE_TOKEN;

/**
 * Search for PUBLIC events by location using discovery API
 * This searches ALL public events on Eventbrite
 * GET /api/eventbrite/search
 */
exports.searchEvents = async (req, res) => {
  try {
    const { location = "Central Asia", radius = 50, sort = "date" } = req.query;

    // Use the destination/events endpoint for public event discovery
    // This works without needing OAuth scopes
    const response = await axios.get(
      `${EVENTBRITE_API_BASE}/destination/events/`,
      {
        headers: {
          Authorization: `Bearer ${EVENTBRITE_TOKEN}`,
        },
        params: {
          "location.address": location,
          "location.within": `${radius}km`,
          expand: "venue,organizer,category",
          "page_size": 50,
        },
      }
    );

    const events = response.data.events || [];
    const formattedEvents = events.map((event) => ({
      id: event.id,
      name: event.name.text,
      description: event.description?.text || event.summary || "No description available",
      url: event.url,
      start: event.start,
      end: event.end,
      created: event.created,
      changed: event.changed,
      capacity: event.capacity,
      status: event.status,
      currency: event.currency,
      isFree: event.is_free,
      onlineEvent: event.online_event,
      venue: event.venue
        ? {
            name: event.venue.name,
            address: event.venue.address,
            latitude: event.venue.latitude,
            longitude: event.venue.longitude,
          }
        : null,
      organizer: event.organizer
        ? {
            name: event.organizer.name,
            description: event.organizer.description?.text,
          }
        : null,
      category: event.category
        ? {
            name: event.category.name,
            shortName: event.category.short_name,
          }
        : null,
      logo: event.logo?.url || null,
      images: event.logo?.url || null,
    }));

    res.json({
      success: true,
      count: formattedEvents.length,
      data: formattedEvents,
      source: "Eventbrite Public Events",
      timestamp: new Date().toISOString(),
      location: location,
    });
  } catch (error) {
    console.error("Eventbrite API Error:", error.response?.data || error.message);
    
    // If public search fails, try getting user's managed events as fallback
    try {
      const myEventsResponse = await axios.get(
        `${EVENTBRITE_API_BASE}/users/me/events/`,
        {
          headers: {
            Authorization: `Bearer ${EVENTBRITE_TOKEN}`,
          },
          params: {
            expand: "venue,organizer,category",
            order_by: "start_asc",
          },
        }
      );

      const events = myEventsResponse.data.events || [];
      const formattedEvents = events.map((event) => ({
        id: event.id,
        name: event.name.text,
        description: event.description?.text || "No description available",
        url: event.url,
        start: event.start,
        end: event.end,
        isFree: event.is_free,
        onlineEvent: event.online_event,
        venue: event.venue,
        organizer: event.organizer,
        category: event.category,
        logo: event.logo?.url || null,
        images: event.logo?.url || null,
      }));

      res.json({
        success: true,
        count: formattedEvents.length,
        data: formattedEvents,
        source: "Your Eventbrite Events",
        timestamp: new Date().toISOString(),
        message: "Showing your managed events (public search unavailable)",
      });
    } catch (fallbackError) {
      res.status(error.response?.status || 500).json({
        success: false,
        message: "Error fetching events from Eventbrite",
        error: error.response?.data?.error_description || error.message,
      });
    }
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
