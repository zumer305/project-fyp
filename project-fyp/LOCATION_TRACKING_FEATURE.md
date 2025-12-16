# Group Location Tracking Feature

## Overview

This feature allows group members to share their real-time location with other members in the group. Members can see each other's locations on an interactive Mapbox map.

## Features Implemented

### 1. **User Model Update**

- Added `location` field to User schema with:
  - `coordinates`: [longitude, latitude] array
  - `lastUpdated`: timestamp of last location update
  - `sharingEnabled`: boolean flag to enable/disable sharing
- Added geospatial index for efficient location queries

### 2. **Backend Endpoints**

#### `POST /api/groups/location/update`

Update the current user's location

```json
{
  "longitude": 74.3587,
  "latitude": 31.5204,
  "sharingEnabled": true
}
```

#### `GET /api/groups/:id/locations`

Get all member locations for a specific group

- Returns only members who have enabled location sharing
- Filters out invalid coordinates (0, 0)

### 3. **Frontend Features**

#### Groups Index Page (`/groups`)

- Added "See Location" button next to "Open Chat" button
- Button opens the location map for the selected group

#### Location Map Page (`/groups/:id/location-map`)

- **Interactive Mapbox Map**: Shows all group members' locations
- **Real-time Location Sharing**:
  - Toggle button to enable/disable location sharing
  - Uses browser's Geolocation API
  - Automatically updates location every 30 seconds
- **Member Markers**:
  - Color-coded circular markers with member initials
  - Clickable markers with popup showing:
    - Member name
    - Exact coordinates
    - Last update timestamp
- **Member List**:
  - Shows all members sharing their location
  - "View" button to fly to each member's location
- **Auto-refresh**: Location updates every 30 seconds
- **Manual Refresh**: Floating refresh button in bottom-right corner

## Usage

### For Group Members:

1. **Navigate to Groups**: Go to `/groups`
2. **Select a Group**: Click on any group card
3. **Click "See Location"**: Opens the location map page
4. **Enable Location Sharing**:
   - Click "Enable Sharing" button
   - Allow browser location permission when prompted
   - Your location will be shared with group members
5. **View Other Members**:
   - See all members who are sharing their location on the map
   - Click on markers to see member details
   - Use "View" button in member list to focus on specific members

### Privacy Controls:

- Location sharing is **OFF by default**
- Users must explicitly enable sharing for each group visit
- Users can stop sharing anytime by clicking "Stop Sharing"
- Location data is only visible to group members

## Technical Details

### Location Tracking:

- Uses HTML5 Geolocation API with `watchPosition()`
- High accuracy mode enabled
- Position updates every 30 seconds
- Coordinates validated before storage (longitude: -180 to 180, latitude: -90 to 90)

### Security:

- Only group members can view member locations
- Requires authentication (session-based)
- Location sharing is opt-in
- Invalid coordinates filtered out

### Map Features:

- Mapbox GL JS v3.0.1
- Custom style: `mapbox://styles/zumer/cmj3y5j60003c01qt3urcac07`
- Navigation controls (zoom, rotate)
- Fullscreen mode
- Automatic bounds fitting to show all members

## Testing

### Test Checklist:

1. ✅ Create a group with multiple members
2. ✅ Navigate to location map
3. ✅ Enable location sharing (grant browser permission)
4. ✅ Verify location appears on map
5. ✅ Have other members enable sharing
6. ✅ Verify all members visible on map
7. ✅ Test marker popups
8. ✅ Test "View" buttons in member list
9. ✅ Test refresh functionality
10. ✅ Disable sharing and verify removal from map

### Browser Requirements:

- HTTPS required for geolocation API (or localhost)
- Modern browser with geolocation support
- Location permissions granted

## Future Enhancements:

- Real-time updates using WebSockets
- Location history/tracking
- Geofencing alerts
- Distance calculations between members
- Route suggestions to meet up
- Battery-efficient location updates

## Files Modified/Created:

### Modified:

1. `models/user.js` - Added location schema
2. `controllers/api/groupsController.js` - Added location endpoints
3. `routes/api/groups.js` - Added location routes
4. `routes/groups.js` - Added location map route
5. `views/groups/index.ejs` - Added "See Location" button

### Created:

1. `views/groups/location-map.ejs` - Location map view

## API Routes Added:

- `POST /api/groups/location/update` - Update user location
- `GET /api/groups/:id/locations` - Get member locations
- `GET /groups/:id/location-map` - Location map view

---

**Note**: Make sure to restart the server after these changes to apply the User model updates.
