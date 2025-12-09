# World Time API Integration Guide

## Overview

This project integrates the **API Ninjas World Time API** to display local times for different cities and countries. This is particularly useful for showing travelers the current time at their destination.

## API Details

- **Provider**: API Ninjas
- **Endpoint**: `https://api.api-ninjas.com/v1/worldtime?city={city}`
- **API Key**: `4PPOYi+ElgRrQAd/ICe5xQ==BkzSE1x6k3Nv4wVr`
- **Documentation**: https://api-ninjas.com/api/worldtime

## Features Implemented

### 1. Backend API Controller (`controllers/api/worldTimeController.js`)

- Fetches time data from API Ninjas World Time API
- Accepts `city` or `country` query parameters
- Returns formatted time data including:
  - Current time (hour, minute, second)
  - Date information (year, month, day)
  - Day of week
  - Timezone information

### 2. API Route (`routes/api/worldTime.js`)

- **Endpoint**: `GET /api/worldtime`
- **Query Parameters**:
  - `city` - City name (e.g., "London", "Tokyo")
  - `country` - Country name (e.g., "Kazakhstan", "France")

### 3. Client-Side JavaScript Library (`public/js/worldTime.js`)

Provides utility functions for working with world time:

```javascript
// Fetch local time for a location
await WorldTime.getLocalTime("London");

// Display time in a specific element
await WorldTime.displayTimeInElement("elementId", "Paris", false);

// Format time in 12-hour format
WorldTime.formatTime12Hour(14, 30); // Returns "2:30 PM"

// Format time in 24-hour format
WorldTime.formatTime24Hour(14, 30); // Returns "14:30"

// Get day name from number
WorldTime.getDayName(1); // Returns "Monday"
```

### 4. UI Integration

#### Listing Details Page (`views/listings/show.ejs`)

Displays the local time for the listing's location:

```html
<i class="bi bi-clock"></i> Local Time:
<span id="local-time-display">Loading...</span>
```

#### Listings Index Page (`views/listings/index.ejs`)

Shows local time for each listing card:

```html
<span class="local-time" data-location="London">--:--</span>
```

#### World Time Test Page (`views/listings/worldtime.ejs`)

Standalone page to test the World Time API:

- Access at: `/listings/worldtime`
- Features:
  - Search for any city or country
  - Quick access buttons for popular locations
  - Displays full time details with timezone
  - Shows day of week, hour, and minute breakdown

## Usage Examples

### Example 1: Display time in HTML

```html
<div id="time-display"></div>

<script>
  WorldTime.displayTimeInElement("time-display", "Tokyo", false);
</script>
```

### Example 2: Fetch time data programmatically

```javascript
const result = await WorldTime.getLocalTime("New York");
if (result.success) {
  console.log(result.data.timezone); // "America/New_York"
  console.log(result.data.time); // "14:30"
}
```

### Example 3: Display time with auto-refresh

```javascript
async function updateTime() {
  await WorldTime.displayTimeInElement("clock", "Paris", true);
}

// Update every minute
updateTime();
setInterval(updateTime, 60000);
```

## API Response Format

```json
{
  "timezone": "Europe/London",
  "datetime": "2025-12-09 14:30:45",
  "date": "2025-12-09",
  "time": "14:30",
  "hour": 14,
  "minute": 30,
  "second": 45,
  "day_of_week": 1,
  "year": 2025,
  "month": 12,
  "day": 9,
  "location": "London"
}
```

## Configuration

The API key is configured in the controller. For production, it's recommended to move it to environment variables:

```javascript
// In .env file
WORLD_TIME_API_KEY=4PPOYi+ElgRrQAd/ICe5xQ==BkzSE1x6k3Nv4wVr

// In controller
const apiKey = process.env.WORLD_TIME_API_KEY;
```

## Testing

1. **Test Page**: Visit `/listings/worldtime` to test the API with different cities
2. **Listing Pages**: Check any listing detail page to see local time
3. **Index Page**: Browse all listings to see time for each location

## Styling

Time displays use Bootstrap Icons and custom CSS classes:

- `.local-time` - For time displays in cards
- `#local-time-display` - For main time display on detail pages

Custom styles in `public/css/style.css`:

```css
.local-time {
  font-weight: 500;
  color: #0066cc;
  cursor: help;
}
```

## Error Handling

The API gracefully handles errors:

- Invalid city/country names
- API connectivity issues
- Missing location data

Error responses display user-friendly messages like "Time unavailable" or "N/A".

## Browser Compatibility

Works with all modern browsers that support:

- Async/await
- Fetch API
- ES6 JavaScript

## Future Enhancements

1. Add caching to reduce API calls
2. Support for multiple time zones simultaneously
3. Time zone conversion calculator
4. Sunrise/sunset times
5. Local holiday information

## Support

For issues or questions about the World Time API integration, refer to:

- API Ninjas Documentation: https://api-ninjas.com/api/worldtime
- Project repository issues

---

**Last Updated**: December 9, 2025
