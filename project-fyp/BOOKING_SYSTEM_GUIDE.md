# 🎉 Booking System - Complete Implementation Guide

## ✅ What Has Been Implemented

Your tour web app now has a **complete booking request system** where users can:

1. ✈️ Select a package from the packages page
2. 📋 Fill out a booking form with travel details
3. ✉️ Receive automatic email confirmation
4. 📊 View and manage their bookings
5. ❌ Cancel bookings if needed

**Admins receive:**
- 🔔 Email notification for every new booking
- 📧 Complete customer and booking details

---

## 📁 Files Created

### Models
- `models/booking.js` - Database schema for bookings

### Controllers
- `controllers/bookings.js` - All booking logic and email sending

### Routes
- `routes/booking.js` - Booking routes

### Views
- `views/bookings/book.ejs` - Booking form page
- `views/bookings/my-bookings.ejs` - User's booking dashboard
- `views/bookings/show.ejs` - Individual booking details

### Configuration
- `.env.example` - Email configuration template

---

## 🚀 Setup Instructions

### Step 1: Configure Email Credentials

1. **Open your `.env` file** (or create one if it doesn't exist)

2. **Add these lines:**

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin-email@gmail.com
```

3. **Get Gmail App Password:**
   - Go to https://myaccount.google.com/security
   - Enable "2-Step Verification"
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and generate a password
   - Copy the 16-character password (remove spaces)
   - Paste it in `EMAIL_PASSWORD`

### Step 2: Verify Installation

The system has already been integrated into your app. The booking routes are now active!

### Step 3: Test the System

1. **Start your server:**
```bash
npm start
```

2. **Login to your account**

3. **Generate a package:**
   - Go to home page
   - Enter country, budget, and days
   - Click "Plan my trip"

4. **Select a package:**
   - Click "Select Package" button
   - You'll be redirected to `/book`

5. **Fill the booking form:**
   - Enter travel dates
   - Enter number of travelers
   - Fill contact information
   - Submit the form

6. **Check emails:**
   - User receives confirmation email
   - Admin receives notification email

7. **View your bookings:**
   - Navigate to `/bookings/my-bookings`
   - Or add a link in your navbar

---

## 🔗 Available Routes

| Route | Method | Description | Auth Required |
|-------|--------|-------------|---------------|
| `/book` | GET | Show booking form | Yes |
| `/book` | POST | Submit booking request | Yes |
| `/bookings/my-bookings` | GET | Show user's bookings | Yes |
| `/bookings/:id` | GET | Show specific booking details | Yes |
| `/bookings/:id/cancel` | POST | Cancel a booking | Yes |

---

## 📧 Email Templates

### User Receives:
- ✅ Booking reference number
- 📦 Complete package details
- 📅 Travel dates and traveler count
- 💰 Total price
- 📝 Next steps information

### Admin Receives:
- 🔔 Immediate notification
- 👤 Customer contact details
- 🏖️ Full booking information
- ⚠️ Action required notice

---

## 🎨 Add "My Bookings" to Navigation

Update your navigation bar to include a link to bookings:

**In `views/includes/navbar.ejs` (or wherever your nav is):**

```html
<% if (currUser) { %>
  <li class="nav-item">
    <a class="nav-link" href="/bookings/my-bookings">
      <i class="fa-solid fa-calendar-check"></i> My Bookings
    </a>
  </li>
<% } %>
```

---

## 💡 How It Works

### User Flow:

1. **Package Selection**
   ```
   Packages Page → Click "Select Package" → Redirected to /book
   ```

2. **Booking Form**
   ```
   Fill details → Submit → Booking saved to database
   ```

3. **Email Notifications**
   ```
   User email sent → Admin email sent → Confirmation page
   ```

4. **Booking Management**
   ```
   View bookings → See details → Cancel if needed
   ```

### Admin Flow:

1. Admin receives email with booking details
2. Admin contacts customer within 24 hours
3. Admin confirms availability
4. Admin sends payment instructions
5. Admin can update booking status manually in database

---

## 🗄️ Database Schema

Each booking contains:

```javascript
{
  user: ObjectId,           // Reference to User
  packageDetails: {
    packageId: String,
    packageTitle: String,
    destination: String,
    country: String,
    totalCost: Number,
    currency: String
  },
  travelDates: {
    startDate: Date,
    endDate: Date
  },
  travelers: {
    adults: Number,
    children: Number
  },
  contactInfo: {
    fullName: String,
    email: String,
    phone: String,
    specialRequests: String
  },
  totalPrice: Number,
  status: String,           // pending, confirmed, cancelled, completed
  bookingReference: String, // Auto-generated unique ID
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 Booking Statuses

| Status | Meaning | User Can |
|--------|---------|----------|
| `pending` | Awaiting admin review | View, Cancel |
| `confirmed` | Admin approved | View, Track, Cancel |
| `cancelled` | Booking cancelled | View only |
| `completed` | Trip finished | View only |

---

## 🔧 Customization Options

### 1. Change Email Service

In `controllers/bookings.js`, update the transporter:

```javascript
// For Outlook
service: "hotmail"

// For Yahoo
service: "yahoo"

// For custom SMTP
host: "smtp.your-domain.com",
port: 587,
secure: false
```

### 2. Adjust Child Pricing

In `controllers/bookings.js`, line ~216:

```javascript
const childRate = 0.7; // Children pay 70% - Change this value
```

### 3. Customize Email Templates

Edit the HTML in `sendUserConfirmationEmail()` and `sendAdminNotificationEmail()` functions in `controllers/bookings.js`.

### 4. Add Payment Integration

Later, you can integrate:
- **Stripe**: `npm install stripe`
- **PayPal**: `npm install @paypal/checkout-server-sdk`
- **Razorpay**: `npm install razorpay`

---

## 🐛 Troubleshooting

### Email not sending?
1. Check `.env` file has correct credentials
2. Verify Gmail App Password is correct (16 chars, no spaces)
3. Check console for error messages
4. Ensure 2FA is enabled on Gmail

### Booking form not showing?
1. Make sure user is logged in
2. Check if package data is passed correctly
3. View browser console for JavaScript errors

### Cannot access /book route?
1. Restart your server after changes
2. Verify `routes/booking.js` is imported in `app.js`
3. Check for authentication middleware

### Database errors?
1. Ensure MongoDB is running
2. Check connection string in `app.js`
3. Verify `models/booking.js` is correct

---

## 📝 Next Steps (Optional Enhancements)

1. **Admin Dashboard**
   - Create `/admin/bookings` to view all bookings
   - Allow admin to update booking status
   - Add filters and search

2. **Payment Integration**
   - Integrate Stripe/PayPal
   - Process actual payments
   - Generate invoices

3. **Notifications**
   - Add SMS notifications (Twilio)
   - Push notifications
   - WhatsApp integration

4. **PDF Generation**
   - Generate booking vouchers
   - Create itinerary PDFs
   - Email as attachments

5. **Calendar Integration**
   - Add to Google Calendar
   - iCal export
   - Reminder emails

---

## 📞 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify all files are in correct locations
3. Ensure all dependencies are installed
4. Check `.env` configuration

---

## 🎊 Success!

Your booking system is now fully functional! Users can:
- ✅ Select packages
- ✅ Submit booking requests
- ✅ Receive email confirmations
- ✅ View their booking history
- ✅ Track booking status
- ✅ Cancel bookings

And you (admin) receive detailed email notifications for every booking! 🚀

---

## 🔐 Security Notes

- User authentication required for all booking operations
- Booking data is validated before saving
- Email errors don't prevent booking creation
- Users can only view/cancel their own bookings
- Booking references are unique and secure

---

**Created on:** December 17, 2025
**Status:** ✅ Fully Implemented & Ready to Use
