# Group Travel Planner - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB running on `mongodb://127.0.0.1:27017`
- Browser with JavaScript enabled

### Installation

The feature is already integrated into your project. No additional installation needed!

## 🎯 Quick Test

### Option 1: Using the Web Interface

1. **Start the server:**
   ```bash
   cd project-fyp
   npm start
   ```

2. **Open your browser:**
   - Navigate to `http://localhost:8080`

3. **Create an account:**
   - Click "Signup" in the navbar
   - Fill in your details and register

4. **Access Groups:**
   - Click "Groups" in the navbar
   - You'll see the Group Travel Planner page

5. **Create your first group:**
   - Click the "Create" button
   - Fill in:
     - Group Name: "Weekend Getaway"
     - Description: "Fun trip with friends"
     - Destination: "Paris"
     - Dates and budget (optional)
   - Click "Create Group"
   - **Copy the invite code** that appears

6. **Test with second user:**
   - Open an incognito/private browser window
   - Go to `http://localhost:8080`
   - Sign up with a different account
   - Click "Groups" in navbar
   - Click "Join" button
   - Enter the invite code
   - You're now in the group!

7. **Start chatting:**
   - Click "Open Chat" on the group card
   - Type a message and hit Enter
   - Switch between browser windows to see real-time updates

### Option 2: Using the Test Script

1. **Make sure your server is running:**
   ```bash
   npm start
   ```

2. **In a new terminal, run the test:**
   ```bash
   node test-group-feature.js
   ```

3. **Watch the automated tests:**
   - Creates 2 test users
   - Creates a group
   - Sends messages
   - Tests join functionality
   - Verifies everything works

## 📱 Features to Try

### 1. Create Multiple Groups
- Create different groups for different trips
- Each gets a unique invite code
- Organize by destination or dates

### 2. Real-Time Chat
- Open the same group in 2 browsers
- Send messages from one
- See them appear instantly in the other
- All messages saved to MongoDB

### 3. Group Management
- View all your groups on `/groups`
- See member count and details
- Copy invite codes to share
- Leave groups when done

### 4. Chat Features
- Send text messages (up to 2000 characters)
- See timestamps (relative and absolute)
- Different message styles for you vs others
- System messages for joins/leaves
- Auto-scroll to latest messages

## 🎨 User Interface

### Main Groups Page (`/groups`)
```
┌─────────────────────────────────────┐
│  🎯 Group Travel Planner            │
├─────────────────────────────────────┤
│  [Create Group] [Join Group] [Chat] │
├─────────────────────────────────────┤
│  📋 My Groups                        │
│  ┌───────────┐ ┌───────────┐       │
│  │ Paris     │ │ Tokyo     │       │
│  │ Trip      │ │ 2026      │       │
│  │ 3 members │ │ 2 members │       │
│  │ ABC123    │ │ XYZ789    │       │
│  └───────────┘ └───────────┘       │
└─────────────────────────────────────┘
```

### Chat Page (`/groups/:id/chat`)
```
┌──────────┬────────────────────────┐
│ Group    │  💬 Group Chat         │
│ Info     ├────────────────────────┤
├──────────┤                        │
│ Paris    │  [Messages appear      │
│ Trip     │   here with            │
│          │   timestamps]          │
│ Members: │                        │
│ • Alice  │                        │
│ • Bob    │                        │
│ • Carol  │                        │
│          ├────────────────────────┤
│ Invite:  │ [Type message...] Send │
│ ABC123   └────────────────────────┘
└──────────┘
```

## 🔧 Troubleshooting

### Cannot see Groups link in navbar
- Make sure you're logged in
- Refresh the page
- Check browser console for errors

### Real-time chat not working
- Check Socket.IO connection (green "Connected" badge)
- Verify MongoDB is running
- Check server console for Socket.IO logs

### Invite code not working
- Codes are case-insensitive
- Check for typos
- Ensure group is still active

### Messages not saving
- Verify MongoDB connection
- Check server logs for errors
- Test with HTTP message endpoint directly

## 📚 Next Steps

1. **Explore the API:**
   - Check `GROUP_TRAVEL_PLANNER.md` for full API documentation
   - Test endpoints with Postman

2. **Customize:**
   - Modify UI styles in the EJS files
   - Add more group features (polls, expenses, etc.)
   - Integrate with other parts of your app

3. **Enhance:**
   - Add image sharing
   - Implement location sharing
   - Create expense splitting
   - Build itinerary planner

## 💡 Tips

- **Invite Codes** are 8 characters (e.g., "A1B2C3D4")
- **Messages** are limited to 2000 characters
- **Group Names** can be up to 100 characters
- **Real-time** updates work via Socket.IO
- **History** is always preserved in MongoDB

## 📞 Support

If you encounter issues:

1. Check the server console for errors
2. Check browser console for client errors
3. Verify MongoDB is running: `mongod --version`
4. Test with the automated script: `node test-group-feature.js`
5. Review `GROUP_TRAVEL_PLANNER.md` for detailed docs

## ✅ Success Checklist

- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] Can access `/groups` page
- [ ] Can create a group
- [ ] Invite code is generated
- [ ] Can join with invite code
- [ ] Real-time chat works
- [ ] Messages persist in database
- [ ] Can see message history
- [ ] Can leave group

---

**Ready to go!** Visit `http://localhost:8080/groups` and start planning your trips! 🎉
