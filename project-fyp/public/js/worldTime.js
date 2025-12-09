// World Time Utility for fetching and displaying local time
const WorldTime = {
  /**
   * Fetch local time for a city or country
   * @param {string} location - City or country name
   * @returns {Promise<Object>} Time data or error
   */
  async getLocalTime(location) {
    try {
      if (!location) {
        return { success: false, error: "Location is required" };
      }

      const response = await fetch(
        `/api/worldtime?city=${encodeURIComponent(location)}`
      );
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Failed to fetch time",
        };
      }

      return { success: true, data };
    } catch (error) {
      console.error("World Time API Error:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Format time in 12-hour format
   * @param {number} hour - Hour (0-23)
   * @param {number} minute - Minute (0-59)
   * @returns {string} Formatted time string
   */
  formatTime12Hour(hour, minute) {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    const displayMinute = String(minute).padStart(2, "0");
    return `${displayHour}:${displayMinute} ${period}`;
  },

  /**
   * Format time in 24-hour format
   * @param {number} hour - Hour (0-23)
   * @param {number} minute - Minute (0-59)
   * @returns {string} Formatted time string
   */
  formatTime24Hour(hour, minute) {
    const displayHour = String(hour).padStart(2, "0");
    const displayMinute = String(minute).padStart(2, "0");
    return `${displayHour}:${displayMinute}`;
  },

  /**
   * Get day of week name
   * @param {number} dayNumber - Day number (0-6, where 0 is Sunday)
   * @returns {string} Day name
   */
  getDayName(dayNumber) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[dayNumber] || "Unknown";
  },

  /**
   * Display time in a specific element
   * @param {string} elementId - ID of the element to update
   * @param {string} location - City or country name
   * @param {boolean} use24Hour - Use 24-hour format (default: false)
   */
  async displayTimeInElement(elementId, location, use24Hour = false) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with ID '${elementId}' not found`);
      return;
    }

    element.textContent = "Loading time...";

    const result = await this.getLocalTime(location);

    if (!result.success) {
      element.textContent = "Time unavailable";
      element.title = result.error;
      return;
    }

    const { hour, minute, timezone, day_of_week } = result.data;
    const formattedTime = use24Hour
      ? this.formatTime24Hour(hour, minute)
      : this.formatTime12Hour(hour, minute);

    element.textContent = formattedTime;
    if (timezone) {
      element.title = `${timezone} - ${this.getDayName(day_of_week)}`;
    }
  },

  /**
   * Create and return a formatted time string with all details
   * @param {Object} timeData - Time data from API
   * @param {boolean} use24Hour - Use 24-hour format
   * @returns {string} Formatted string
   */
  formatFullTimeString(timeData, use24Hour = false) {
    const { hour, minute, second, timezone, day_of_week, date } = timeData;
    const time = use24Hour
      ? this.formatTime24Hour(hour, minute)
      : this.formatTime12Hour(hour, minute);

    const dayName = this.getDayName(day_of_week);

    return `${dayName}, ${date} - ${time}${timezone ? ` (${timezone})` : ""}`;
  },

  /**
   * Update multiple time displays for a location
   * @param {string} location - City or country name
   * @param {Array<Object>} elements - Array of {selector, use24Hour} objects
   */
  async updateMultipleDisplays(location, elements) {
    const result = await this.getLocalTime(location);

    if (!result.success) {
      elements.forEach(({ selector }) => {
        const el = document.querySelector(selector);
        if (el) {
          el.textContent = "Time unavailable";
          el.title = result.error;
        }
      });
      return;
    }

    elements.forEach(({ selector, use24Hour = false, format = "time" }) => {
      const el = document.querySelector(selector);
      if (!el) return;

      const { hour, minute, timezone, day_of_week } = result.data;

      if (format === "time") {
        const formattedTime = use24Hour
          ? this.formatTime24Hour(hour, minute)
          : this.formatTime12Hour(hour, minute);
        el.textContent = formattedTime;
      } else if (format === "full") {
        el.textContent = this.formatFullTimeString(result.data, use24Hour);
      } else if (format === "timezone") {
        el.textContent = timezone || "Unknown timezone";
      }

      if (timezone) {
        el.title = `${timezone} - ${this.getDayName(day_of_week)}`;
      }
    });
  },
};

// Make it available globally
if (typeof window !== "undefined") {
  window.WorldTime = WorldTime;
}
