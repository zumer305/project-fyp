const express = require("express");
const router = express.Router();
const axios = require("axios");
const wrapAsync = require("../../utils/wrapAsync");

// GET LIVE EVENTS ONLY - NO DUMMY DATA
router.get(
  "/",
  wrapAsync(async (req, res) => {
    try {
      const { destination, lat, lng, countryCode } = req.query;

      console.log("\n========== EVENTS API REQUEST ==========");
      console.log("📥 Request Query:", req.query);
      console.log(`🌍 Fetching LIVE events for: ${destination || "location"}`);

      // Use coordinates or geocode the destination
      let latitude = parseFloat(lat);
      let longitude = parseFloat(lng);
      let country = countryCode;

      console.log(`📊 Initial coords: lat=${latitude}, lng=${longitude}`);

      // If no coordinates provided, geocode the destination
      if ((!latitude || !longitude) && destination) {
        const geoData = await geocodeLocation(destination);
        if (geoData) {
          latitude = geoData.lat;
          longitude = geoData.lng;
          country = geoData.countryCode;
          console.log(
            `📍 Geocoded: ${destination} -> ${latitude}, ${longitude}`
          );
        }
      }

      // Fetch REAL events from live APIs only
      console.log(
        `🚀 Calling fetchLiveEventsOnly with lat=${latitude}, lng=${longitude}, dest=${destination}`
      );
      const eventsData = await fetchLiveEventsOnly(
        latitude,
        longitude,
        destination,
        country
      );
      console.log(`✅ Received ${eventsData.length} events from APIs`);

      if (eventsData.length === 0) {
        console.log("⚠️  No events found, sending empty response");
        return res.json({
          success: true,
          count: 0,
          data: [],
          source: "Live Event APIs",
          timestamp: new Date().toISOString(),
          location: destination || "Unknown",
          message: `No live events found for ${destination}. Try searching for major cities like London, New York, Paris, Tokyo, Sydney, Toronto, Berlin, etc.`,
        });
      }

      res.json({
        success: true,
        count: eventsData.length,
        data: eventsData,
        source: eventsData[0]?.apiSource || "Live Event APIs",
        timestamp: new Date().toISOString(),
        location: destination || "Unknown",
        coordinates: { latitude, longitude },
      });
    } catch (error) {
      console.error("❌ Error fetching live events:", error.message);

      res.status(500).json({
        success: false,
        message: "Error fetching live events",
        error: error.message,
      });
    }
  })
);

// Geocode location to coordinates and country
async function geocodeLocation(locationName) {
  if (!locationName) return null;

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q: locationName,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "TravelEventsApp/1.0",
        },
        timeout: 5000,
      }
    );

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        countryCode: result.address?.country_code?.toUpperCase() || "US",
        displayName: result.display_name,
      };
    }
  } catch (error) {
    console.error("Geocoding error:", error.message);
  }
  return null;
}

// Fetch LIVE events from real APIs ONLY
async function fetchLiveEventsOnly(lat, lng, destination, countryCode) {
  console.log("\n========== FETCHING LIVE EVENTS ==========");
  console.log(`📍 Coordinates: ${lat}, ${lng}`);
  console.log(`📌 Destination: ${destination}`);
  const allEvents = [];

  if (!lat || !lng) {
    console.log("❌ No coordinates available, cannot fetch events");
    return allEvents;
  }

  // Try multiple real event APIs in parallel
  console.log("🔄 Calling SeatGeek and OSM APIs...");
  const apiPromises = [
    fetchFromSeatGeek(lat, lng),
    fetchFromOSM(lat, lng, destination),
  ];

  // Note: Ticketmaster requires API key - uncomment if you have one
  // apiPromises.push(fetchFromTicketmaster(lat, lng, countryCode));

  try {
    const results = await Promise.allSettled(apiPromises);
    console.log(`📦 Received ${results.length} API responses`);

    results.forEach((result, index) => {
      const apiName = index === 0 ? "SeatGeek" : "OSM";
      if (
        result.status === "fulfilled" &&
        result.value &&
        result.value.length > 0
      ) {
        allEvents.push(...result.value);
        console.log(`✅ ${apiName}: Added ${result.value.length} events`);
      } else if (result.status === "fulfilled") {
        console.log(`⚠️  ${apiName}: No events returned`);
      } else {
        console.log(`❌ ${apiName}: Failed - ${result.reason}`);
      }
    });
  } catch (error) {
    console.error("❌ Error fetching from APIs:", error.message);
  }

  console.log(`📊 Total LIVE events found: ${allEvents.length}`);
  console.log("==========================================\n");
  return allEvents;
}

// Fetch from Ticketmaster (requires free API key from developer.ticketmaster.com)
async function fetchFromTicketmaster(lat, lng, countryCode) {
  try {
    console.log("🎫 Trying Ticketmaster API...");

    // Get your free API key from: https://developer.ticketmaster.com/
    const TICKETMASTER_API_KEY =
      process.env.TICKETMASTER_API_KEY || "YOUR_API_KEY_HERE";

    if (TICKETMASTER_API_KEY === "YOUR_API_KEY_HERE") {
      console.log("⚠️  Ticketmaster API key not configured");
      return [];
    }

    const response = await axios.get(
      "https://app.ticketmaster.com/discovery/v2/events.json",
      {
        params: {
          apikey: TICKETMASTER_API_KEY,
          latlong: `${lat},${lng}`,
          radius: "50",
          unit: "km",
          size: "50",
          sort: "date,asc",
        },
        timeout: 10000,
      }
    );

    if (
      response.data &&
      response.data._embedded &&
      response.data._embedded.events
    ) {
      const events = response.data._embedded.events.map((event) => ({
        id: event.id,
        name: event.name,
        type: event.classifications?.[0]?.segment?.name || "Event",
        date: event.dates?.start?.localDate || "TBA",
        start: {
          local: event.dates?.start?.dateTime || event.dates?.start?.localDate,
          utc: event.dates?.start?.dateTime,
        },
        description:
          event.info ||
          event.pleaseNote ||
          `${event.name} - Check event page for details`,
        location: event._embedded?.venues?.[0]?.city?.name || "TBA",
        venue: {
          name: event._embedded?.venues?.[0]?.name || "Venue TBA",
          address: {
            localized_address_display:
              event._embedded?.venues?.[0]?.address?.line1 || "",
          },
          latitude: event._embedded?.venues?.[0]?.location?.latitude,
          longitude: event._embedded?.venues?.[0]?.location?.longitude,
        },
        price: event.priceRanges?.[0]
          ? `${event.priceRanges[0].min}-${event.priceRanges[0].max} ${event.priceRanges[0].currency}`
          : "Check website",
        url: event.url,
        images: event.images?.[0]?.url,
        logo: event.images?.[0]?.url,
        isFree: false,
        is_free: false,
        onlineEvent: false,
        online_event: false,
        category: {
          name: event.classifications?.[0]?.genre?.name || "General",
        },
        apiSource: "Ticketmaster Live API",
        updatedAt: new Date().toISOString(),
      }));

      console.log(`✅ Ticketmaster: Found ${events.length} live events`);
      return events;
    }
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("⚠️  Ticketmaster API: Invalid API key");
    } else {
      console.log("Ticketmaster API error:", error.message);
    }
  }
  return [];
}

// Fetch from SeatGeek (FREE - no API key required)
async function fetchFromSeatGeek(lat, lng) {
  try {
    console.log(
      `🎟️  Calling SeatGeek API with lat=${lat}, lng=${lng}, range=50km`
    );

    const response = await axios.get("https://api.seatgeek.com/2/events", {
      params: {
        lat: lat,
        lon: lng,
        range: "50km",
        per_page: 50,
        sort: "datetime_local.asc",
      },
      timeout: 10000,
    });

    console.log(`📡 SeatGeek response status: ${response.status}`);
    console.log(
      `📦 SeatGeek events count: ${response.data?.events?.length || 0}`
    );

    if (
      response.data &&
      response.data.events &&
      response.data.events.length > 0
    ) {
      const events = response.data.events.map((event) => {
        // Get the best available image
        let imageUrl = null;
        if (event.performers && event.performers.length > 0) {
          // Try to get image from primary performer
          imageUrl =
            event.performers[0]?.image || event.performers[0]?.images?.huge;
        }

        // Fallback to event image if available
        if (!imageUrl && event.image) {
          imageUrl = event.image;
        }

        console.log(
          `Event: ${event.title}, Image: ${imageUrl ? "Found" : "None"}`
        );

        return {
          id: `seatgeek-${event.id}`,
          name: event.title || event.short_title,
          type: event.type,
          date: event.datetime_local?.split("T")[0] || "TBA",
          start: {
            local: event.datetime_local,
            utc: event.datetime_utc,
          },
          description:
            event.description ||
            `${event.type} event at ${event.venue?.name}. ${event.performers
              ?.map((p) => p.name)
              .join(", ")}`,
          location: `${event.venue?.city}, ${
            event.venue?.state || event.venue?.country
          }`,
          venue: {
            name: event.venue?.name || "Venue TBA",
            address: {
              localized_address_display: event.venue?.address || "",
            },
            latitude: event.venue?.location?.lat,
            longitude: event.venue?.location?.lon,
          },
          price: event.stats?.lowest_price
            ? `From $${event.stats.lowest_price}`
            : "Check website",
          url: event.url,
          images: imageUrl,
          logo: imageUrl,
          isFree: false,
          is_free: false,
          onlineEvent: false,
          online_event: false,
          isVenue: false, // This is a real event with a date
          category: {
            name: event.type,
          },
          apiSource: "SeatGeek Live API",
          updatedAt: new Date().toISOString(),
        };
      });

      console.log(`✅ SeatGeek: Found ${events.length} live events`);
      return events;
    }
  } catch (error) {
    console.log("SeatGeek API error:", error.message);
  }
  return [];
}

// Fetch venues from OpenStreetMap that host events
async function fetchFromOSM(lat, lng, destination) {
  try {
    console.log("🗺️  Trying OpenStreetMap venues...");

    // Query Overpass API for event venues
    const query = `
      [out:json][timeout:10];
      (
        node["amenity"~"theatre|cinema|arts_centre|music_venue|events_venue|conference_centre"](around:25000,${lat},${lng});
        way["amenity"~"theatre|cinema|arts_centre|music_venue|events_venue|conference_centre"](around:25000,${lat},${lng});
        node["tourism"~"museum|gallery|attraction"]["name"](around:25000,${lat},${lng});
        way["leisure"="stadium"](around:25000,${lat},${lng});
      );
      out body 15;
    `;

    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      `data=${encodeURIComponent(query)}`,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 10000,
      }
    );

    if (
      response.data &&
      response.data.elements &&
      response.data.elements.length > 0
    ) {
      const venues = response.data.elements;
      const events = venues.map((venue) => {
        const venueLat = venue.lat || venue.center?.lat;
        const venueLon = venue.lon || venue.center?.lon;

        // Get venue type for better descriptions
        const venueType =
          venue.tags?.amenity ||
          venue.tags?.tourism ||
          venue.tags?.leisure ||
          "venue";
        const venueName =
          venue.tags?.name ||
          `${venueType.replace(/_/g, " ")} in ${destination}`;

        // Create better description based on venue type
        let description = "";
        switch (venueType) {
          case "theatre":
            description = `${venueName} - Popular theatre venue hosting plays, musicals, and performances. Check their website for current show schedules.`;
            break;
          case "cinema":
            description = `${venueName} - Movie theater showing current films. Visit for latest showtimes and special screenings.`;
            break;
          case "music_venue":
            description = `${venueName} - Live music venue featuring concerts and performances. Check their schedule for upcoming shows.`;
            break;
          case "museum":
            description = `${venueName} - Museum with exhibitions and cultural events. Visit for current displays and special programs.`;
            break;
          case "stadium":
            description = `${venueName} - Sports and entertainment stadium. Check for upcoming games, concerts, and major events.`;
            break;
          default:
            description = `${venueName} - Event venue in ${destination}. Visit their website for upcoming events and shows.`;
        }

        return {
          id: `osm-${venue.id}`,
          name: venueName,
          type: venueType,
          date: null, // No date - this is a venue, not an event
          start: null,
          description: venue.tags?.description || description,
          location: destination,
          venue: {
            name: venueName,
            address: {
              localized_address_display:
                [
                  venue.tags?.["addr:street"],
                  venue.tags?.["addr:housenumber"],
                  venue.tags?.["addr:city"],
                ]
                  .filter(Boolean)
                  .join(", ") || destination,
            },
            latitude: venueLat,
            longitude: venueLon,
          },
          price: "Varies by event",
          url:
            venue.tags?.website ||
            venue.tags?.url ||
            venue.tags?.facebook ||
            `https://www.openstreetmap.org/${venue.type}/${venue.id}`,
          images: null, // OSM doesn't provide images
          logo: null,
          isFree: false,
          is_free: false,
          onlineEvent: false,
          online_event: false,
          isVenue: true, // Flag to identify this is a venue, not an actual event
          category: {
            name: venueType
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()),
          },
          apiSource: "Event Venues",
          updatedAt: new Date().toISOString(),
        };
      });

      console.log(`✅ OSM: Found ${events.length} venues`);
      return events;
    }
  } catch (error) {
    console.log("OSM API error:", error.message);
  }
  return [];
}

module.exports = router;
