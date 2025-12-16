# Group Member Location Tracking - Tour Mode

## 🎯 Purpose

Track ALL group members' real-time locations during tours so you can see where everyone is and navigate to them if needed.

## ✨ Key Features

### 1. **Real-Time Member Tracking**

- See ALL group members who have enabled location sharing
- View their exact positions on an interactive map
- Each member gets a unique colored marker with their initial
- Auto-updates every 30 seconds

### 2. **Member Information**

Each member shows:

- ✅ **Name**: Full username
- 📍 **Coordinates**: Exact latitude/longitude
- 🕐 **Last Update**: When they last shared location
- 🎨 **Unique Color**: Easy identification on map

### 3. **Navigation to Members**

- Click any member marker
- Click "Navigate to [Member]" button
- Get turn-by-turn directions to reach them
- Blue route line shows the path
- Live tracking updates as you move

### 4. **Your Location Sharing**

- **Enable/Disable**: Toggle button to control sharing
- **Auto-update**: Updates every 5 seconds when enabled
- **Privacy**: Only group members can see you
- **Visual indicator**: Green marker shows your position

## 🗺️ Map Interface

### Layout:

```
┌────────────────────────────────────────────────┐
│  📊 Track Group Members          [Back Button] │
│  Group Name                                     │
│  ℹ️  Live Location Tracking Info Banner        │
├─────────────┬──────────────────────────────────┤
│             │                                   │
│  SIDEBAR    │         MAP VIEW                 │
│  (350px)    │                                   │
│             │    🗺️ [All member markers]       │
│ ┌─────────┐ │                                   │
│ │Location │ │    User A (Blue)                 │
│ │Controls │ │    User B (Green)                │
│ │         │ │    User C (Red)                  │
│ │Sharing: │ │    You (Green Pin if sharing)    │
│ │  OFF    │ │                                   │
│ │[Start]  │ │                                   │
│ └─────────┘ │                                   │
│             │                                   │
│ ┌─────────┐ │                                   │
│ │Members  │ │                [🔄 Refresh]      │
│ │  (3)    │ │                                   │
│ ├─────────┤ │                                   │
│ │👤 abc   │ │                                   │
│ │📍31.5°  │ │                                   │
│ │🕐 2:30  │ │                                   │
│ │[View]   │ │                                   │
│ ├─────────┤ │                                   │
│ │👤 john  │ │                                   │
│ │📍31.6°  │ │                                   │
│ │🕐 2:32  │ │                                   │
│ │[View]   │ │                                   │
│ └─────────┘ │                                   │
└─────────────┴──────────────────────────────────┘
```

## 🚀 How to Use

### For Group Members on Tour:

#### Step 1: Open Location Map

1. Go to your group
2. Click "See Location" button
3. Location tracking page opens

#### Step 2: Enable Location Sharing

1. Click "Start Sharing Location" button
2. Allow browser location permission
3. Your location appears on map
4. Other members can now see you

#### Step 3: View Other Members

- See all members on map with colored markers
- Check member list on left sidebar
- Click any member to see details
- Map shows everyone's position

#### Step 4: Navigate to a Member

1. Click on member's marker
2. Popup shows their info
3. Click "Navigate to [Name]"
4. Route appears on map
5. Follow the blue line to reach them

#### Step 5: Track During Tour

- Map auto-updates every 30 seconds
- Your marker moves as you travel
- See who's where in real-time
- Never lose anyone on the tour!

## 📱 Use Cases

### Scenario 1: City Tour

**Problem**: Group gets separated in crowded market
**Solution**:

- Open location map
- See where everyone is
- Navigate to closest member
- Regroup easily

### Scenario 2: Museum Visit

**Problem**: Different people explore different areas
**Solution**:

- Everyone shares location
- See who's in which section
- Meet up at specific location
- Know when someone's ready to leave

### Scenario 3: Hiking Trip

**Problem**: Some members walk faster/slower
**Solution**:

- Track all hikers on map
- Ensure no one gets lost
- See distance between members
- Wait for slower members

### Scenario 4: Airport Meetup

**Problem**: Finding group members in huge airport
**Solution**:

- Share locations before arrival
- See exact terminal/gate positions
- Navigate through airport
- Meet at designated spot

## 🎨 Visual Elements

### Member Markers:

- **Circle with Initial**: e.g., "A" for "abc"
- **Gradient Background**: Radial gradient for depth
- **Unique Colors**: Blue, Green, Red, Yellow, etc.
- **White Border**: Makes markers stand out
- **Shadow**: Adds 3D effect

### Your Location Marker:

- **Green Circle**: With 📍 pin emoji
- **Pulsing Animation**: Shows it's active
- **"Your Location" label**: Clear identification

### Route Line:

- **Blue Color** (#007acc): Clear visibility
- **4-5px Width**: Easy to follow
- **Smooth Curves**: Natural route flow
- **Outline Shadow**: Depth on map

## 🔧 Technical Details

### Location Update Frequency:

- **Member List Refresh**: Every 30 seconds
- **Your Location Update**: Every 5 seconds (when sharing)
- **Route Tracking**: Every 5 seconds (during navigation)

### Location Accuracy:

- **High Accuracy Mode**: For your location
- **GPS Enabled**: Best positioning
- **Network Fallback**: If GPS unavailable

### Data Stored:

```javascript
{
  userId: "abc123",
  username: "John",
  coordinates: [longitude, latitude],
  lastUpdated: "2025-12-16T14:30:00Z"
}
```

### Privacy:

- ✅ Only group members see locations
- ✅ Sharing is opt-in (must enable)
- ✅ Can stop sharing anytime
- ✅ No location history stored
- ✅ Session-based only

## 🎯 Member List Features

### Shows for Each Member:

1. **Profile Initial**: First letter of name
2. **Full Name**: Complete username
3. **Coordinates**: Lat/Long with 4 decimal places
4. **Last Update**: Time of last location share
5. **View Button**: Focus on their location

### Interactions:

- **Click Member**: Fly to their location on map
- **View Button**: Center map on member
- **Auto-scroll**: List scrolls with many members

## 🗺️ Map Features

### Controls:

- ✅ **Zoom In/Out**: Navigation controls
- ✅ **Rotate**: Compass control
- ✅ **Fullscreen**: Expand to full screen
- ✅ **Attribution**: Compact Mapbox credit

### Interactions:

- **Click Marker**: Show member popup
- **Drag Map**: Pan around
- **Scroll**: Zoom in/out
- **Double-click**: Zoom to location

### Auto-behaviors:

- **Auto-fit**: Shows all members initially
- **Single member**: Zooms to their location
- **Route active**: Fits route in view

## 📊 Member Status

### When Members ARE Sharing:

- ✅ Visible on map
- ✅ Shows in member list
- ✅ Real-time updates
- ✅ Can navigate to them

### When Members NOT Sharing:

- ❌ Not visible on map
- ❌ Not in member list
- ❌ Privacy maintained
- ❌ Can't be tracked

## 🔄 Refresh Behavior

### Auto-refresh (Every 30 seconds):

- Updates all member locations
- Refreshes member list
- Updates timestamps
- No user action needed

### Manual Refresh:

- Click 🔄 button (bottom-right)
- Instant location update
- Useful for quick checks

## 🎉 Benefits

1. **Safety**: Never lose group members
2. **Efficiency**: Find members quickly
3. **Coordination**: Know where everyone is
4. **Peace of Mind**: Track in real-time
5. **Easy Meetups**: Navigate to exact locations
6. **Tour Management**: Guide leader can monitor all

## 📱 Mobile Friendly

- Responsive layout (stacks on mobile)
- Touch-friendly buttons
- Swipe to pan map
- Pinch to zoom
- Works on all devices

---

**Perfect for group tours, travel adventures, and keeping everyone together!** 🌍✨
