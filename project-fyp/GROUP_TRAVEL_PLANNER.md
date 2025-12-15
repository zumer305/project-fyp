# Group Travel Planner Feature

## Overview
The Group Travel Planner allows users to create travel groups, invite friends, and chat in real-time to plan trips together. All chat history is stored in MongoDB for persistence.

## Features

### 1. Create Group
- Users can create a new travel group with:
  - Group name (required)
  - Description
  - Destination
  - Start and end dates
  - Budget (amount and currency)
- Automatic generation of unique 8-character invite code
- Creator is automatically added as the first member

### 2. Join Group
- Users can join existing groups using an invite code
- Validates that the group exists and is active
- Prevents duplicate memberships
- System message notifies existing members when someone joins

### 3. Real-Time Group Chat
- **Socket.IO Integration**: Real-time messaging without page refresh
- **MongoDB Persistence**: All messages saved to database with timestamps
- **Message History**: Full chat history loaded when opening a group
- **Online Status**: Shows connection status
- **System Messages**: Automatic notifications for joins/leaves
- **Message Features**:
  - Text messages up to 2000 characters
  - Timestamp display (relative and absolute)
  - Message bubbles with different styles for own/other messages
  - Auto-scroll to latest messages

### 4. Group Management
- View all your groups
- See group details (members, destination, dates, budget)
- Copy and share invite codes
- Leave groups (ownership transfers if creator leaves)
- Groups deactivate when all members leave

## Technical Implementation

### Database Models

#### Group Model (`models/group.js`)
```javascript
{
  name: String (required, max 100 chars),
  description: String (max 500 chars),
  inviteCode: String (unique, auto-generated),
  creator: ObjectId (ref: User),
  members: [ObjectId] (ref: User),
  destination: String,
  startDate: Date,
  endDate: Date,
  budget: {
    amount: Number,
    currency: String (default: "USD")
  },
  isActive: Boolean (default: true),
  timestamps: true
}
```

#### Message Model (`models/message.js`)
```javascript
{
  group: ObjectId (ref: Group, required, indexed),
  user: ObjectId (ref: User, required),
  content: String (required, max 2000 chars),
  type: String (enum: ["text", "system", "location", "image"]),
  isRead: [ObjectId] (ref: User),
  metadata: Mixed,
  timestamps: true
}
```

### API Endpoints

#### Group Management
- `POST /api/groups` - Create new group
- `GET /api/groups` - Get user's groups
- `GET /api/groups/:id` - Get group details
- `PUT /api/groups/:id` - Update group (creator only)
- `POST /api/groups/:id/join` - Join by group ID
- `POST /api/groups/join-code` - Join by invite code
- `POST /api/groups/:id/leave` - Leave group

#### Messages
- `GET /api/groups/:id/messages` - Get message history (paginated)
- `POST /api/groups/:id/messages` - Send message (HTTP fallback)

#### Trip Planning (Stub)
- `GET /api/groups/:id/plan` - Get itinerary
- `GET /api/groups/:id/expenses` - Get expense summary

### Frontend Routes
- `GET /groups` - Groups index page
- `GET /groups/:id/chat` - Group chat page

### Socket.IO Events

#### Client → Server
- `join` - Join group room
  ```javascript
  { groupId, userId }
  ```
- `message` - Send message
  ```javascript
  { groupId, userId, username, content }
  ```
- `leave` - Leave group room
  ```javascript
  { groupId, userId }
  ```
- `location-update` - Share location (future feature)
  ```javascript
  { groupId, userId, coords }
  ```

#### Server → Client
- `message` - New message broadcast
  ```javascript
  { id, userId, username, content, createdAt, type }
  ```
- `system` - System event notification
  ```javascript
  { type: "join"|"leave", userId, timestamp }
  ```
- `location-update` - Location update broadcast
  ```javascript
  { userId, coords, timestamp }
  ```

## Usage Guide

### For Users

1. **Creating a Group**:
   - Navigate to `/groups`
   - Click "Create" button
   - Fill in group details (at minimum, group name)
   - Click "Create Group"
   - Copy the generated invite code and share with friends

2. **Joining a Group**:
   - Get invite code from friend
   - Navigate to `/groups`
   - Click "Join" button
   - Enter the invite code
   - Click "Join Group"

3. **Chatting in a Group**:
   - Click on a group card or "Open Chat" button
   - View group info and members in the left sidebar
   - Type message in the input at the bottom
   - Press Enter or click Send
   - All messages are saved automatically

4. **Managing Groups**:
   - View all your groups on the main groups page
   - Click "Leave Group" to exit a group
   - Only group creators can update group details

### For Developers

#### Adding the Feature to Your Project

1. **Models are ready** - Already updated with enhanced features

2. **Controllers are ready** - Full CRUD operations implemented

3. **Routes are configured**:
   - API routes in `/routes/api/groups.js`
   - View routes in `/routes/groups.js`

4. **Socket.IO is configured** in `app.js`

5. **Frontend views created**:
   - `/views/groups/index.ejs` - Main groups page
   - `/views/groups/chat.ejs` - Group chat page

#### Testing the Feature

1. Start your MongoDB server
2. Start the application:
   ```bash
   npm start
   ```
3. Create an account or login
4. Navigate to `/groups`
5. Create a test group
6. Open another browser (or incognito window)
7. Login with different account
8. Join using the invite code
9. Test real-time chat

#### Authentication Requirements

All group endpoints require authentication:
- Uses `requireAuth` middleware for API routes
- Uses `isLoggedIn` middleware for view routes
- User info from `req.user` (Passport.js)

#### Database Queries

The implementation uses efficient queries:
- Indexed group lookups by invite code
- Indexed message queries by group
- Population of user and creator references
- Pagination support for message history

## Security Features

1. **Invite Code Uniqueness**: Cryptographically random codes with collision detection
2. **Member Verification**: All operations verify user is a group member
3. **Creator Privileges**: Only creators can update group settings
4. **Content Validation**: Message length limits and sanitization
5. **Authentication Required**: All endpoints protected

## Future Enhancements

Planned features for future development:

1. **Location Sharing**: Real-time member location on map
2. **Expense Tracking**: Split bills and track group expenses
3. **Itinerary Planning**: Collaborative trip itinerary builder
4. **Polls and Voting**: Vote on destinations, activities, dates
5. **File Sharing**: Share photos, documents, tickets
6. **Push Notifications**: Notify users of new messages
7. **Video/Voice Chat**: Integrated communication
8. **Trip Timeline**: Visual timeline of planned activities
9. **Weather Integration**: Group destination weather forecasts
10. **Activity Suggestions**: AI-powered activity recommendations

## Troubleshooting

### Messages Not Showing in Real-Time
- Check Socket.IO connection (status indicator in chat)
- Verify MongoDB is running
- Check browser console for errors
- Ensure user is authenticated

### Cannot Join Group
- Verify invite code is correct (case-insensitive)
- Check group is still active
- Ensure you're logged in

### Database Connection Issues
- Verify MongoDB is running on `mongodb://127.0.0.1:27017/wanderlust`
- Check database connection in app.js

## API Response Examples

### Create Group Success
```json
{
  "success": true,
  "group": {
    "_id": "...",
    "name": "Summer Trip to Paris",
    "inviteCode": "A1B2C3D4",
    "creator": {...},
    "members": [...],
    ...
  },
  "inviteCode": "A1B2C3D4"
}
```

### Get Messages Success
```json
{
  "success": true,
  "messages": [
    {
      "_id": "...",
      "group": "...",
      "user": {
        "_id": "...",
        "username": "john_doe"
      },
      "content": "Let's meet at 9 AM!",
      "type": "text",
      "createdAt": "2025-12-15T10:30:00.000Z"
    }
  ],
  "total": 25,
  "hasMore": false
}
```

## Dependencies

Required packages (already in package.json):
- `socket.io` - Real-time communication
- `mongoose` - MongoDB ODM
- `express` - Web framework
- `passport` - Authentication
- `crypto` - Invite code generation (built-in Node.js)

## File Structure

```
project-fyp/
├── models/
│   ├── group.js          # Enhanced group model
│   └── message.js        # Enhanced message model
├── controllers/
│   └── api/
│       └── groupsController.js  # All group operations
├── routes/
│   ├── groups.js         # View routes
│   └── api/
│       └── groups.js     # API routes
├── views/
│   └── groups/
│       ├── index.ejs     # Groups listing page
│       └── chat.ejs      # Group chat page
└── app.js                # Socket.IO configuration
```

## Support

For issues or questions:
1. Check this documentation
2. Review console logs (browser and server)
3. Verify all dependencies are installed
4. Test API endpoints directly using Postman/curl
5. Check MongoDB for data persistence

---

**Version**: 1.0.0  
**Last Updated**: December 15, 2025  
**Author**: FYP Development Team
