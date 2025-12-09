const axios = require("axios");

// Mapping of common cities/countries to timezones (for worldtimeapi.org)
const locationToTimezone = {
  // Cities
  london: "Europe/London",
  paris: "Europe/Paris",
  tokyo: "Asia/Tokyo",
  "new york": "America/New_York",
  dubai: "Asia/Dubai",
  sydney: "Australia/Sydney",
  "los angeles": "America/Los_Angeles",
  singapore: "Asia/Singapore",
  "hong kong": "Asia/Hong_Kong",
  istanbul: "Europe/Istanbul",
  moscow: "Europe/Moscow",
  beijing: "Asia/Shanghai",
  mumbai: "Asia/Kolkata",
  delhi: "Asia/Kolkata",

  // Central Asia
  kazakhstan: "Asia/Almaty",
  almaty: "Asia/Almaty",
  astana: "Asia/Almaty",
  "nur-sultan": "Asia/Almaty",
  kyrgyzstan: "Asia/Bishkek",
  bishkek: "Asia/Bishkek",
  tajikistan: "Asia/Dushanbe",
  dushanbe: "Asia/Dushanbe",
  uzbekistan: "Asia/Tashkent",
  tashkent: "Asia/Tashkent",
  samarkand: "Asia/Samarkand",
  bukhara: "Asia/Samarkand",
  turkmenistan: "Asia/Ashgabat",
  ashgabat: "Asia/Ashgabat",
  "central asia": "Asia/Tashkent",
  "central asian": "Asia/Tashkent",
  afghanistan: "Asia/Kabul",
  kabul: "Asia/Kabul",
  azerbaijan: "Asia/Baku",
  baku: "Asia/Baku",

  // Countries
  pakistan: "Asia/Karachi",
  karachi: "Asia/Karachi",
  islamabad: "Asia/Karachi",
  india: "Asia/Kolkata",
  china: "Asia/Shanghai",
  japan: "Asia/Tokyo",
  france: "Europe/Paris",
  germany: "Europe/Berlin",
  spain: "Europe/Madrid",
  italy: "Europe/Rome",
  "united kingdom": "Europe/London",
  uk: "Europe/London",
  usa: "America/New_York",
  canada: "America/Toronto",
  australia: "Australia/Sydney",
  brazil: "America/Sao_Paulo",
  mexico: "America/Mexico_City",
};

module.exports.getTime = async (req, res) => {
  try {
    const { city, country, timezone } = req.query;

    if (!city && !country && !timezone) {
      return res
        .status(400)
        .json({ message: "city, country, or timezone parameter required" });
    }

    let selectedTimezone = timezone;

    // If city or country provided, map to timezone
    if (!selectedTimezone) {
      const location = (city || country || "").toLowerCase().trim();

      // Try exact match first
      selectedTimezone = locationToTimezone[location];

      // If no exact match, try partial matching (e.g., "Dushanbe, Central Asian" -> "dushanbe")
      if (!selectedTimezone) {
        // Extract first word (usually the city name)
        const firstWord = location.split(/[,\s]+/)[0];
        selectedTimezone = locationToTimezone[firstWord];
      }

      // If still no match, try to find any key that includes the location
      if (!selectedTimezone) {
        for (const [key, value] of Object.entries(locationToTimezone)) {
          if (
            location.includes(key) ||
            key.includes(location.split(/[,\s]+/)[0])
          ) {
            selectedTimezone = value;
            break;
          }
        }
      }

      if (!selectedTimezone) {
        // Default to UTC if location not found
        selectedTimezone = "UTC";
      }
    }

    // Use worldtimeapi.org - completely free!
    const url = `https://worldtimeapi.org/api/timezone/${selectedTimezone}`;

    const { data } = await axios.get(url, {
      timeout: 5000, // 5 second timeout
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!data || !data.datetime) {
      return res
        .status(404)
        .json({ message: "Time data not found for this location" });
    }

    // Parse the datetime
    const datetime = new Date(data.datetime);
    const hour = datetime.getHours();
    const minute = datetime.getMinutes();
    const second = datetime.getSeconds();
    const day_of_week = datetime.getDay();

    const payload = {
      timezone: data.timezone,
      datetime: data.datetime,
      date: datetime.toISOString().split("T")[0],
      time: `${hour}:${String(minute).padStart(2, "0")}`,
      hour: hour,
      minute: minute,
      second: second,
      day_of_week: day_of_week,
      year: datetime.getFullYear(),
      month: datetime.getMonth() + 1,
      day: datetime.getDate(),
      location: city || country || selectedTimezone,
      utc_offset: data.utc_offset,
      abbreviation: data.abbreviation,
    };

    return res.json(payload);
  } catch (e) {
    console.error("World Time API Error:", e.code || e.message);

    // If it's a network error, provide a fallback using server time
    if (
      e.code === "ECONNRESET" ||
      e.code === "ETIMEDOUT" ||
      e.code === "ECONNREFUSED"
    ) {
      // Calculate approximate time based on timezone offset
      const timezoneOffsets = {
        "Asia/Dushanbe": 5,
        "Asia/Tashkent": 5,
        "Asia/Almaty": 6,
        "Asia/Bishkek": 6,
        "Asia/Ashgabat": 5,
        "Asia/Karachi": 5,
        "Asia/Kolkata": 5.5,
        "Asia/Dubai": 4,
        "Europe/London": 0,
        "Europe/Paris": 1,
        "America/New_York": -5,
        "Asia/Tokyo": 9,
      };

      const { city, country, timezone } = req.query;
      const location = city || country || "";
      let selectedTimezone = timezone;

      if (!selectedTimezone) {
        const loc = location.toLowerCase().trim();
        const firstWord = loc.split(/[,\s]+/)[0];
        selectedTimezone =
          locationToTimezone[loc] || locationToTimezone[firstWord] || "UTC";
      }

      const offset = timezoneOffsets[selectedTimezone] || 0;
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const localTime = new Date(utc + 3600000 * offset);

      return res.json({
        timezone: selectedTimezone,
        datetime: localTime.toISOString(),
        date: localTime.toISOString().split("T")[0],
        time: `${localTime.getHours()}:${String(
          localTime.getMinutes()
        ).padStart(2, "0")}`,
        hour: localTime.getHours(),
        minute: localTime.getMinutes(),
        second: localTime.getSeconds(),
        day_of_week: localTime.getDay(),
        year: localTime.getFullYear(),
        month: localTime.getMonth() + 1,
        day: localTime.getDate(),
        location: location || selectedTimezone,
        fallback: true,
        message: "Using server-calculated time (WorldTimeAPI unavailable)",
      });
    }

    // Try to provide helpful error messages
    if (e.response?.status === 404) {
      return res.status(404).json({
        message: "Location not found. Try using a major city name or timezone.",
        error: "Invalid timezone",
      });
    }

    return res.status(500).json({
      message: "Failed to fetch world time",
      error: e.response?.data || e.message,
    });
  }
};

// Optional: Get list of available timezones
module.exports.getTimezones = async (req, res) => {
  try {
    const { data } = await axios.get("https://worldtimeapi.org/api/timezone");
    return res.json({ timezones: data });
  } catch (e) {
    return res.status(500).json({ message: "Failed to fetch timezones" });
  }
};
