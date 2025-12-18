# 📧 Email Setup Guide - Booking Notifications

## 🎯 Overview

When a user creates a booking, the system will send:

1. **Confirmation email** to the user's email address
2. **Notification email** to admin (ai.based.destination.explorer@gmail.com)

## 🔐 Gmail App Password Setup

Since you're using Gmail, you need to create an **App Password** (not your regular Gmail password).

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** (left sidebar)
3. Under "Signing in to Google", click **2-Step Verification**
4. Follow the steps to enable 2FA if not already enabled

### Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords (at the bottom)
2. Click **Select app** → Choose "Mail"
3. Click **Select device** → Choose "Windows Computer" or "Other (Custom name)"
4. Enter name: "Travel Booking System"
5. Click **Generate**
6. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

### Step 3: Update .env File

Replace the password in your `.env` file:

```properties
EMAIL_USER=ai.based.destination.explorer@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
# ☝️ Paste your 16-character app password here (remove spaces)
```

**Important**: Remove all spaces from the app password!

## ✅ Current Configuration

```properties
FROM: ai.based.destination.explorer@gmail.com
TO (User): [User's email from booking form]
TO (Admin): ai.based.destination.explorer@gmail.com
```

### What Happens When User Books:

1. **User fills booking form** with their email
2. **System creates booking** in database
3. **Two emails are sent**:

   **Email 1 - To User:**

   - Subject: "Booking Confirmation - BK-xxxxx"
   - Content: Booking details, reference number, what's next

   **Email 2 - To Admin (you):**

   - Subject: "🔔 New Booking Request - BK-xxxxx"
   - Content: Customer info, package details, action required

## 🧪 Testing Email System

### Option 1: Use the Test Script

```bash
cd c:\Users\Hp\Desktop\fyp\project-fyp
node test-booking-creation.js
```

This will:

- Create a test booking
- Send emails to both user and admin
- Check server console for email status

### Option 2: Create a Real Booking

1. Start your server: `npm start`
2. Login to the website
3. Select a package
4. Fill booking form with your email
5. Submit booking
6. Check `ai.based.destination.explorer@gmail.com` inbox

## 📨 Email Templates

### User Confirmation Email

```
Subject: 🎉 Booking Request Received! - BK-xxxxx

Dear [User Name],

Thank you for choosing us! We've received your booking request.

Your Booking Reference: BK-xxxxx

📦 Booking Details
- Package: [Package Name]
- Destination: [Country]
- Travel Dates: [Start] - [End]
- Travelers: [X Adults, Y Children]
- Total Price: [Currency] [Amount]

What's Next?
• Our team will review within 24 hours
• We'll confirm availability
• You'll receive payment instructions
• Complete itinerary will be sent

Questions? Reply to this email.
```

### Admin Notification Email

```
Subject: 🔔 New Booking Request - BK-xxxxx

⚠️ Action Required: New booking submitted

📋 Booking Information
- Reference: BK-xxxxx
- Status: PENDING
- Booking Date: [Date/Time]

👤 Customer Information
- Name: [Full Name]
- Email: [Email]
- Phone: [Phone]

🏖️ Package Details
- Package: [Name]
- Destination: [Country]
- Duration: [X Days]

📅 Travel Information
- Start: [Date]
- End: [Date]
- Adults: [X]
- Children: [Y]

💰 Total Price: [Currency] [Amount]

Next Steps:
1. Verify package availability
2. Contact customer within 24 hours
3. Send payment instructions
```

## 🐛 Troubleshooting

### Error: "Invalid login"

**Solution**: Make sure you're using App Password, not regular password

### Error: "Username and Password not accepted"

**Solutions**:

1. Enable "Less secure app access" (not recommended)
2. Use App Password instead (recommended)
3. Check 2FA is enabled

### Emails not sending but booking created

**This is OK!** Emails are sent asynchronously and won't block booking creation.

**Check**:

1. Server console for email errors
2. .env file has correct credentials
3. App Password is correct (no spaces)
4. Internet connection is working

### Test email sending directly:

```javascript
// test-email.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ai.based.destination.explorer@gmail.com",
    pass: "your-app-password-here", // 16-character app password
  },
});

transporter.sendMail(
  {
    from: "ai.based.destination.explorer@gmail.com",
    to: "ai.based.destination.explorer@gmail.com",
    subject: "Test Email - Booking System",
    text: "If you receive this, email is working!",
  },
  (err, info) => {
    if (err) console.error("❌ Error:", err);
    else console.log("✅ Email sent:", info.messageId);
  }
);
```

Run: `node test-email.js`

## 📊 Email Status Indicators

Server console shows:

- `✅ User confirmation email sent successfully`
- `✅ Admin notification email sent successfully`
- `⚠️ Email sending error: [details]`

## 🔒 Security Notes

1. **Never commit .env file** to git (it's in .gitignore)
2. **Use App Passwords** instead of regular passwords
3. **Rotate passwords** periodically
4. **Keep credentials private**

## 📞 Support

If emails still don't work after following this guide:

1. Check server console for specific error messages
2. Verify Gmail account settings
3. Try sending test email with script above
4. Check spam folder for test emails

---

**Remember**: Booking will succeed even if email fails. Email sending is non-blocking!
