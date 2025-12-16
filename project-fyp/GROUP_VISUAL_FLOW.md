# Group Travel Planner - Visual Flow Diagram

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
├─────────────────────────────────────────────────────────────────┤
│  Browser 1 (User A)          Browser 2 (User B)                 │
│  ┌──────────────┐            ┌──────────────┐                  │
│  │ /groups      │            │ /groups      │                  │
│  │ - Create     │            │ - Join Code  │                  │
│  │ - Join       │            │              │                  │
│  └──────┬───────┘            └──────┬───────┘                  │
│         │                           │                           │
│         v                           v                           │
│  ┌──────────────┐            ┌──────────────┐                  │
│  │ /groups/:id  │ <─────────>│ /groups/:id  │                  │
│  │ /chat        │  Real-Time │ /chat        │                  │
│  └──────────────┘  Messages  └──────────────┘                  │
└─────────┬───────────────────────────┬─────────────────────────┘
          │                           │
          │      Socket.IO (Real-Time)│
          │                           │
┌─────────┴───────────────────────────┴─────────────────────────┐
│                      EXPRESS SERVER                            │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    │
│  │   Routes     │───>│ Controllers  │───>│   Models     │    │
│  │              │    │              │    │              │    │
│  │ /api/groups  │    │ groupsCtrl   │    │ Group        │    │
│  │ /groups      │    │              │    │ Message      │    │
│  └──────────────┘    └──────────────┘    └──────┬───────┘    │
│                                                   │             │
│  ┌──────────────────────────────────────────────┐│            │
│  │         Socket.IO Server                     ││            │
│  │  - Connection handling                       ││            │
│  │  - Room management (group:xxx)              ││            │
│  │  - Real-time message broadcasting           ││            │
│  └──────────────────────────────────────────────┘│            │
└────────────────────────────────────────────────────┼───────────┘
                                                     │
                                                     v
┌────────────────────────────────────────────────────────────────┐
│                       MONGODB DATABASE                         │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐              ┌─────────────────┐         │
│  │  groups         │              │  messages       │         │
│  ├─────────────────┤              ├─────────────────┤         │
│  │ _id             │              │ _id             │         │
│  │ name            │              │ group (ref)     │         │
│  │ inviteCode      │              │ user (ref)      │         │
│  │ creator (ref)   │              │ content         │         │
│  │ members (refs)  │              │ type            │         │
│  │ destination     │              │ createdAt       │         │
│  │ startDate       │              │ updatedAt       │         │
│  │ endDate         │              └─────────────────┘         │
│  │ budget          │                                           │
│  │ isActive        │              Index: group, createdAt     │
│  │ createdAt       │                                           │
│  │ updatedAt       │                                           │
│  └─────────────────┘                                           │
│                                                                 │
│  Index: inviteCode (unique)                                    │
└────────────────────────────────────────────────────────────────┘
```

## 🔄 User Flow: Create Group

```
User A (Browser)
     │
     v
┌────────────────┐
│ Visit /groups  │
└────────┬───────┘
         │
         v
┌────────────────┐
│ Click "Create" │
└────────┬───────┘
         │
         v
┌────────────────────┐
│ Fill Group Details │
│ - Name             │
│ - Destination      │
│ - Dates            │
│ - Budget           │
└────────┬───────────┘
         │
         v
┌────────────────────┐
│ Submit Form        │
└────────┬───────────┘
         │
         v
    POST /api/groups
         │
         v
┌────────────────────┐
│ Controller:        │
│ - Validate data    │
│ - Generate code    │
│ - Create group     │
│ - Add user as      │
│   creator/member   │
│ - Save to MongoDB  │
└────────┬───────────┘
         │
         v
┌────────────────────┐
│ Response:          │
│ - Group object     │
│ - Invite code      │
└────────┬───────────┘
         │
         v
┌────────────────────┐
│ Show Success Modal │
│ Display invite code│
│ "ABC12345"         │
└────────────────────┘
```

## 🎫 User Flow: Join Group

```
User B (Browser)
     │
     v
┌────────────────┐
│ Receive invite │
│ code from      │
│ User A         │
└────────┬───────┘
         │
         v
┌────────────────┐
│ Visit /groups  │
└────────┬───────┘
         │
         v
┌────────────────┐
│ Click "Join"   │
└────────┬───────┘
         │
         v
┌────────────────┐
│ Enter code:    │
│ "ABC12345"     │
└────────┬───────┘
         │
         v
POST /api/groups/join-code
         │
         v
┌────────────────────┐
│ Controller:        │
│ - Find group by    │
│   invite code      │
│ - Verify active    │
│ - Check not        │
│   already member   │
│ - Add to members   │
│ - Create system    │
│   message          │
└────────┬───────────┘
         │
         v
┌────────────────────┐
│ Response:          │
│ - Group object     │
│ - Success message  │
└────────┬───────────┘
         │
         v
┌────────────────────┐
│ Redirect to        │
│ /groups/:id/chat   │
└────────────────────┘
```

## 💬 Real-Time Chat Flow

```
User A                          Server                        User B
  │                               │                             │
  │ 1. Open /groups/:id/chat      │                             │
  ├──────────────────────────────>│                             │
  │                               │                             │
  │ 2. Load HTML/JS               │                             │
  │<──────────────────────────────┤                             │
  │                               │                             │
  │ 3. Socket.IO connect          │                             │
  ├──────────────────────────────>│                             │
  │                               │                             │
  │ 4. Emit 'join'                │                             │
  ├──────────────────────────────>│                             │
  │                               │                             │
  │                          Join room                          │
  │                          "group:xxx"                        │
  │                               │                             │
  │                               │   5. User B opens chat      │
  │                               │<────────────────────────────┤
  │                               │                             │
  │                               │   6. Socket connect + join  │
  │                               │<────────────────────────────┤
  │                               │                             │
  │                          Both in same                        │
  │                          Socket.IO room                      │
  │                               │                             │
  │ 7. Type "Hello!"              │                             │
  │    Press Enter                │                             │
  │                               │                             │
  │ 8. Emit 'message'             │                             │
  ├──────────────────────────────>│                             │
  │                               │                             │
  │                          9. Save to                          │
  │                             MongoDB                          │
  │                               │                             │
  │ 10. Broadcast to room         │                             │
  │<──────────────────────────────┤                             │
  │                               │────────────────────────────>│
  │                               │   11. Receive message       │
  │                               │                             │
  │ 12. Display in UI             │   13. Display in UI         │
  │    (own message style)        │       (other message style) │
  │                               │                             │
```

## 🗄️ Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     CREATE GROUP                            │
└─────────────────────────────────────────────────────────────┘

Frontend Form Data                 MongoDB Document
┌──────────────┐                  ┌──────────────┐
│ name         │ ───────────────> │ name         │
│ description  │                  │ description  │
│ destination  │                  │ destination  │
│ startDate    │                  │ startDate    │
│ endDate      │                  │ endDate      │
│ budget       │                  │ budget       │
└──────────────┘                  │              │
                                  │ + inviteCode │ (auto-generated)
                                  │ + creator    │ (from req.user)
                                  │ + members[]  │ (includes creator)
                                  │ + isActive   │ (default: true)
                                  │ + timestamps │ (auto)
                                  └──────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     SEND MESSAGE                            │
└─────────────────────────────────────────────────────────────┘

Socket Event                       MongoDB Document
┌──────────────┐                  ┌──────────────┐
│ groupId      │ ───────────────> │ group        │
│ userId       │                  │ user         │
│ content      │                  │ content      │
└──────────────┘                  │ type: "text" │
                                  │ createdAt    │ (auto)
                                  └──────────────┘
                                         │
                                         v
                                  Broadcast to all
                                  group members
```

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│              API Request Authentication                     │
└─────────────────────────────────────────────────────────────┘

Request with Token
┌──────────────────┐
│ Authorization:   │
│ Bearer abc123... │
└────────┬─────────┘
         │
         v
┌────────────────────┐
│ requireAuth        │
│ Middleware         │
│                    │
│ 1. Check session   │─── if authenticated ──> Continue
│    (Passport)      │
│                    │
│ 2. Check JWT       │─── if valid token ──> Continue
│    token           │
│                    │
│ 3. Verify user     │─── if invalid ──────> 401 Unauthorized
└────────────────────┘
         │
         v
┌────────────────────┐
│ req.user populated │
│ - id               │
│ - role             │
└────────────────────┘
         │
         v
    Controller
```

## 🎨 Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    /groups (Index Page)                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │              Header & Navigation                   │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │   Create    │  │    Join     │  │  Group Chat │      │
│  │   Group     │  │    Group    │  │             │      │
│  │   Card      │  │    Card     │  │    Card     │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
│                                                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │              My Groups List                       │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐       │    │
│  │  │ Group 1  │  │ Group 2  │  │ Group 3  │       │    │
│  │  │ Card     │  │ Card     │  │ Card     │       │    │
│  │  └──────────┘  └──────────┘  └──────────┘       │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │            Modal: Create Group                    │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │            Modal: Join Group                      │    │
│  └───────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              /groups/:id/chat (Chat Page)                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┬──────────────────────────────────────────┐  │
│  │          │          Chat Header                     │  │
│  │          ├──────────────────────────────────────────┤  │
│  │  Group   │                                          │  │
│  │  Info    │          Messages Container              │  │
│  │  Panel   │          (scrollable)                    │  │
│  │          │                                          │  │
│  │  - Name  │  ┌────────────────────────────┐         │  │
│  │  - Desc  │  │ System: User joined        │         │  │
│  │  - Dest  │  └────────────────────────────┘         │  │
│  │          │                                          │  │
│  │ Members  │  ┌────────────────────────────┐         │  │
│  │  • User1 │  │ User A: Hello everyone!    │         │  │
│  │  • User2 │  └────────────────────────────┘         │  │
│  │          │                                          │  │
│  │ Invite   │         ┌────────────────────────────┐  │  │
│  │ Code     │         │ User B: Hi there!          │  │  │
│  │ ABC123   │         └────────────────────────────┘  │  │
│  │          │                                          │  │
│  │ Actions  ├──────────────────────────────────────────┤  │
│  │  Leave   │  [Type message...] [Send]                │  │
│  └──────────┴──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Reference

### Key Files

- **Models**: `models/group.js`, `models/message.js`
- **Controllers**: `controllers/api/groupsController.js`
- **Routes**: `routes/groups.js`, `routes/api/groups.js`
- **Views**: `views/groups/index.ejs`, `views/groups/chat.ejs`
- **Styles**: `public/css/groups.css`

### Main Endpoints

- `GET /groups` - Groups page
- `POST /api/groups` - Create group
- `POST /api/groups/join-code` - Join group
- `GET /groups/:id/chat` - Chat page
- `GET /api/groups/:id/messages` - Get messages

### Socket Events

- `join` - Join room
- `message` - Send message
- `leave` - Leave room

---

This diagram provides a visual representation of how the Group Travel Planner works!
