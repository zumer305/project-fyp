# AI Chatbot Integration - Setup Instructions

## 🚀 Quick Start

Your AI Travel Chatbot has been integrated into your website! Here's what you need to do:

### 1. Start the Django Chatbot Server

Open a terminal and navigate to the chatbot backend:

```bash
cd ai_travel_chatbot_rag/backend
python manage.py runserver
```

The chatbot API will run on `http://localhost:8000/api/chat/`

### 2. Start Your Main Website

In another terminal, start your Node.js/Express website:

```bash
cd project-fyp
npm start
```

### 3. That's It!

Visit your website and you'll see a purple chatbot icon at the bottom right corner of every page!

---

## 🎨 Features

- **Fixed Position**: Chatbot icon appears on all pages at bottom right
- **Clean UI**: Modern, professional design with smooth animations
- **Responsive**: Works on mobile, tablet, and desktop
- **Keyboard Shortcut**: Press `Ctrl+K` (or `Cmd+K` on Mac) to open/close
- **Real-time**: Messages sent to your AI chatbot backend
- **User-friendly**: Typing indicators, error handling, auto-scroll

---

## ⚙️ Configuration

### Update API URL

If your Django server runs on a different port, update the API URL in:

**File**: `project-fyp/public/js/chatbot.js`

```javascript
const CHATBOT_API_URL = 'http://localhost:8000/api/chat/'; // Change port if needed
```

### Customize Colors

Edit the chatbot colors in:

**File**: `project-fyp/public/css/chatbot.css`

Look for the gradient colors (currently purple):
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

---

## 🐛 Troubleshooting

### Chatbot shows error message

1. **Check Django server is running**:
   ```bash
   cd ai_travel_chatbot_rag/backend
   python manage.py runserver
   ```

2. **Check CORS settings** in `backend/settings.py`:
   ```python
   CORS_ALLOW_ALL_ORIGINS = True  # Should be enabled
   ```

3. **Check browser console** (F12) for error messages

### Chatbot doesn't appear

1. Clear browser cache and refresh (Ctrl+Shift+R)
2. Check browser console for JavaScript errors
3. Verify files exist:
   - `/public/css/chatbot.css`
   - `/public/js/chatbot.js`
   - `/views/partials/chatbot.ejs`

---

## 📱 How Users Interact

1. Click the purple chatbot icon at bottom right
2. Type a message about Central Asia travel
3. Press Enter or click Send button
4. Receive AI-powered response
5. Continue conversation or close chatbot

---

## 🔒 Security Notes

- Currently set to `CORS_ALLOW_ALL_ORIGINS = True` for development
- For production, restrict CORS to your domain:
  ```python
  CORS_ALLOWED_ORIGINS = [
      "https://yourdomain.com",
  ]
  ```

---

## 💡 Tips

- The chatbot remembers context during the page session
- Chatbot state resets on page refresh
- Works on all pages that use the `boiler.ejs` layout
- Mobile-responsive design adjusts for smaller screens

---

Enjoy your new AI Travel Chatbot! 🤖✈️
