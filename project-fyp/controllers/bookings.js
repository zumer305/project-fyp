const Booking = require("../models/booking");
const nodemailer = require("nodemailer");

// Email configuration
const createEmailTransporter = () => {
  // Using Gmail as an example. You can change this to your preferred email service
  // For Gmail: Enable "Less secure app access" or use App Password
  return nodemailer.createTransport({
    service: "gmail", // or 'smtp.gmail.com'
    auth: {
      user: process.env.EMAIL_USER || "your-email@gmail.com", // Set in .env file
      pass: process.env.EMAIL_PASSWORD || "your-app-password", // Set in .env file
    },
  });
};

// Send confirmation email to user
const sendUserConfirmationEmail = async (booking, userEmail) => {
  try {
    const transporter = createEmailTransporter();

    const adminEmail =
      process.env.ADMIN_EMAIL || process.env.EMAIL_USER || "admin@example.com";

    const mailOptions = {
      from: process.env.EMAIL_USER || "your-email@gmail.com",
      to: userEmail,
      subject: `Booking Confirmation - ${booking.bookingReference}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #007bff; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-row:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #666; }
            .value { color: #333; }
            .reference { background: #e7f3ff; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
            .reference-number { font-size: 24px; font-weight: bold; color: #007bff; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .button { display: inline-block; padding: 12px 30px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Booking Request Received!</h1>
            </div>
            <div class="content">
              <p>Dear ${booking.contactInfo.fullName},</p>
              <p>Thank you for choosing us! We've received your booking request and our team will review it shortly.</p>
              
              <div class="reference">
                <p style="margin: 0; font-size: 14px;">Your Booking Reference:</p>
                <p class="reference-number">${booking.bookingReference}</p>
              </div>

              <div class="booking-details">
                <h3 style="margin-top: 0;">📦 Booking Details</h3>
                <div class="detail-row">
                  <span class="label">Package:</span>
                  <span class="value">${
                    booking.packageDetails.packageTitle || "Custom Package"
                  }</span>
                </div>
                <div class="detail-row">
                  <span class="label">Destination:</span>
                  <span class="value">${
                    booking.packageDetails.destination ||
                    booking.packageDetails.country
                  }</span>
                </div>
                <div class="detail-row">
                  <span class="label">Travel Dates:</span>
                  <span class="value">${new Date(
                    booking.travelDates.startDate
                  ).toLocaleDateString()} - ${new Date(
        booking.travelDates.endDate
      ).toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Travelers:</span>
                  <span class="value">${booking.travelers.adults} Adult(s)${
        booking.travelers.children > 0
          ? `, ${booking.travelers.children} Child(ren)`
          : ""
      }</span>
                </div>
                <div class="detail-row">
                  <span class="label">Total Price:</span>
                  <span class="value" style="font-size: 18px; font-weight: bold; color: #007bff;">${
                    booking.packageDetails.currency
                  } ${booking.totalPrice.toLocaleString()}</span>
                </div>
              </div>

              ${
                booking.contactInfo.specialRequests
                  ? `
              <div class="booking-details">
                <h4 style="margin-top: 0;">Special Requests:</h4>
                <p>${booking.contactInfo.specialRequests}</p>
              </div>
              `
                  : ""
              }

              <p><strong>What's Next?</strong></p>
              <ul>
                <li>Our team will review your booking within 24 hours</li>
                <li>We'll confirm availability for your selected dates</li>
                <li>You'll receive payment instructions via email</li>
                <li>Once confirmed, we'll send your complete itinerary</li>
              </ul>

              <p>If you have any questions, feel free to reply to this email or contact us at ${
                process.env.EMAIL_USER || "support@example.com"
              }</p>

              <div class="footer">
                <p>This is an automated email. Please save your booking reference for future correspondence.</p>
                <p style="margin-top: 10px;">© ${new Date().getFullYear()} Travel Planner. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ User confirmation email sent successfully");
  } catch (error) {
    console.error("❌ Error sending user confirmation email:", error);
    // Don't throw error - booking should still be saved even if email fails
  }
};

// Send notification email to admin
const sendAdminNotificationEmail = async (booking) => {
  try {
    const transporter = createEmailTransporter();

    const adminEmail =
      process.env.ADMIN_EMAIL || process.env.EMAIL_USER || "admin@example.com";

    const mailOptions = {
      from: process.env.EMAIL_USER || "your-email@gmail.com",
      to: adminEmail,
      subject: `🔔 New Booking Request - ${booking.bookingReference}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 700px; margin: 0 auto; padding: 20px; }
            .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .detail-row { padding: 8px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #666; display: inline-block; width: 180px; }
            .value { color: #333; }
            .section-title { color: #007bff; margin-top: 20px; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 New Booking Request</h1>
              <p style="margin: 10px 0 0 0;">Immediate Action Required</p>
            </div>
            <div class="content">
              <div class="alert">
                <strong>⚠️ Action Required:</strong> A new booking request has been submitted. Please review and contact the customer within 24 hours.
              </div>

              <div class="booking-details">
                <h3 style="margin-top: 0;">📋 Booking Information</h3>
                <div class="detail-row">
                  <span class="label">Booking Reference:</span>
                  <span class="value"><strong>${
                    booking.bookingReference
                  }</strong></span>
                </div>
                <div class="detail-row">
                  <span class="label">Status:</span>
                  <span class="value" style="color: #ffc107; font-weight: bold;">⏳ ${booking.status.toUpperCase()}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Booking Date:</span>
                  <span class="value">${new Date(
                    booking.createdAt
                  ).toLocaleString()}</span>
                </div>
              </div>

              <div class="booking-details">
                <h3 class="section-title">👤 Customer Information</h3>
                <div class="detail-row">
                  <span class="label">Name:</span>
                  <span class="value">${booking.contactInfo.fullName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Email:</span>
                  <span class="value"><a href="mailto:${
                    booking.contactInfo.email
                  }">${booking.contactInfo.email}</a></span>
                </div>
                <div class="detail-row">
                  <span class="label">Phone:</span>
                  <span class="value"><a href="tel:${
                    booking.contactInfo.phone
                  }">${booking.contactInfo.phone}</a></span>
                </div>
              </div>

              <div class="booking-details">
                <h3 class="section-title">🏖️ Package Details</h3>
                <div class="detail-row">
                  <span class="label">Package:</span>
                  <span class="value">${
                    booking.packageDetails.packageTitle || "Custom Package"
                  }</span>
                </div>
                <div class="detail-row">
                  <span class="label">Destination:</span>
                  <span class="value">${
                    booking.packageDetails.destination ||
                    booking.packageDetails.country
                  }</span>
                </div>
                <div class="detail-row">
                  <span class="label">Duration:</span>
                  <span class="value">${
                    booking.packageDetails.duration || "N/A"
                  }</span>
                </div>
              </div>

              <div class="booking-details">
                <h3 class="section-title">📅 Travel Information</h3>
                <div class="detail-row">
                  <span class="label">Start Date:</span>
                  <span class="value">${new Date(
                    booking.travelDates.startDate
                  ).toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                  <span class="label">End Date:</span>
                  <span class="value">${new Date(
                    booking.travelDates.endDate
                  ).toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Adults:</span>
                  <span class="value">${booking.travelers.adults}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Children:</span>
                  <span class="value">${booking.travelers.children}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Total Travelers:</span>
                  <span class="value"><strong>${
                    booking.travelers.adults + booking.travelers.children
                  }</strong></span>
                </div>
              </div>

              ${
                booking.contactInfo.specialRequests
                  ? `
              <div class="booking-details">
                <h3 class="section-title">💬 Special Requests</h3>
                <p style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">${booking.contactInfo.specialRequests}</p>
              </div>
              `
                  : ""
              }

              <div class="booking-details">
                <h3 class="section-title">💰 Pricing</h3>
                <div class="detail-row">
                  <span class="label">Total Price:</span>
                  <span class="value" style="font-size: 20px; font-weight: bold; color: #28a745;">${
                    booking.packageDetails.currency
                  } ${booking.totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #ddd;">
                <p><strong>Next Steps:</strong></p>
                <ol>
                  <li>Verify package availability for the requested dates</li>
                  <li>Contact the customer within 24 hours</li>
                  <li>Send payment instructions and confirm booking</li>
                  <li>Update booking status in the system</li>
                </ol>
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #666; font-size: 14px;">Login to admin dashboard to manage this booking</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Admin notification email sent successfully");
  } catch (error) {
    console.error("❌ Error sending admin notification email:", error);
    // Don't throw error - booking should still be saved even if email fails
  }
};

// Controller functions
module.exports.renderBookingForm = async (req, res) => {
  try {
    console.log("📄 Rendering booking form for user:", req.user ? req.user.username : "Unknown");
    
    // Package data should be passed as URL query parameter from the frontend
    // The frontend already encodes the package in the URL
    res.render("bookings/book", {
      packageData: null, // Will be populated by frontend from localStorage
      currentUser: req.user || null,
    });
  } catch (error) {
    console.error("❌ Error rendering booking form:", error);
    req.flash("error", "Unable to load booking form");
    res.redirect("/");
  }
};

module.exports.createBooking = async (req, res) => {
  try {
    console.log("📥 Received booking request");
    console.log("Request body:", req.body);

    const {
      packageId,
      packageDetails,
      startDate,
      endDate,
      adults,
      children,
      fullName,
      email,
      phone,
      specialRequests,
    } = req.body;

    // Validate required fields
    if (!packageId || !packageDetails || !startDate || !endDate || !adults || !fullName || !email || !phone) {
      console.error("❌ Missing required fields");
      req.flash("error", "Please fill in all required fields");
      return res.redirect("/book");
    }

    // Parse package details
    let parsedPackageDetails;
    try {
      parsedPackageDetails = JSON.parse(decodeURIComponent(packageDetails));
      console.log("✅ Parsed package details:", parsedPackageDetails);
    } catch (error) {
      console.error("❌ Error parsing package details:", error);
      req.flash("error", "Invalid package data. Please select a package again.");
      return res.redirect("/");
    }

    // Validate package details
    if (!parsedPackageDetails.totalCost && !parsedPackageDetails.price) {
      console.error("❌ Package missing price information");
      req.flash("error", "Package pricing information is missing");
      return res.redirect("/");
    }

    // Calculate total price
    const basePrice = parsedPackageDetails.totalCost || parsedPackageDetails.price || 0;
    const adultsCount = parseInt(adults) || 1;
    const childrenCount = parseInt(children) || 0;
    const childRate = 0.7; // Children pay 70%
    const totalPrice =
      basePrice * adultsCount + basePrice * childrenCount * childRate;

    console.log(`💰 Calculated price: Base=${basePrice}, Adults=${adultsCount}, Children=${childrenCount}, Total=${totalPrice}`);

    // Validate dates
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDateObj < today) {
      console.error("❌ Start date is in the past");
      req.flash("error", "Start date cannot be in the past");
      return res.redirect("/book");
    }

    if (endDateObj < startDateObj) {
      console.error("❌ End date before start date");
      req.flash("error", "End date must be after start date");
      return res.redirect("/book");
    }

    // Create booking
    console.log("📝 Creating booking document...");
    const booking = new Booking({
      user: req.user._id,
      packageDetails: {
        packageId: packageId,
        packageTitle:
          parsedPackageDetails.packageTitle || parsedPackageDetails.title || "Custom Package",
        destination:
          parsedPackageDetails.destination || parsedPackageDetails.country || "Unknown",
        country: parsedPackageDetails.country || parsedPackageDetails.destination,
        duration: parsedPackageDetails.duration || "Flexible",
        totalCost: basePrice,
        currency: parsedPackageDetails.currency || "USD",
        fullPackage: parsedPackageDetails,
      },
      travelDates: {
        startDate: startDateObj,
        endDate: endDateObj,
      },
      travelers: {
        adults: adultsCount,
        children: childrenCount,
      },
      contactInfo: {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        specialRequests: specialRequests ? specialRequests.trim() : "",
      },
      totalPrice: totalPrice,
      status: "pending",
    });

    await booking.save();
    console.log("✅ Booking saved successfully:", booking.bookingReference);

    // Send emails (non-blocking)
    Promise.all([
      sendUserConfirmationEmail(booking, email),
      sendAdminNotificationEmail(booking),
    ]).catch((err) => console.error("⚠️ Email sending error:", err));

    req.flash(
      "success",
      `🎉 Booking request submitted successfully! Your reference number is: ${booking.bookingReference}`
    );
    res.redirect(`/bookings/${booking._id}`);
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    console.error("Error stack:", error.stack);
    
    let errorMessage = "Unable to create booking. Please try again.";
    
    // Provide more specific error messages
    if (error.name === "ValidationError") {
      errorMessage = "Please check all required fields are filled correctly.";
    } else if (error.code === 11000) {
      errorMessage = "Duplicate booking detected. Please try again.";
    }
    
    req.flash("error", errorMessage);
    res.redirect("/book");
  }
};

module.exports.showBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate("user");

    if (!booking) {
      req.flash("error", "Booking not found");
      return res.redirect("/bookings/my-bookings");
    }

    // Check if user owns this booking
    if (!booking.user._id.equals(req.user._id)) {
      req.flash("error", "You don't have permission to view this booking");
      return res.redirect("/bookings/my-bookings");
    }

    res.render("bookings/show", { booking });
  } catch (error) {
    console.error("Error showing booking:", error);
    req.flash("error", "Unable to load booking details");
    res.redirect("/bookings/my-bookings");
  }
};

module.exports.showMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.render("bookings/my-bookings", { bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    req.flash("error", "Unable to load your bookings");
    res.redirect("/");
  }
};

module.exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      req.flash("error", "Booking not found");
      return res.redirect("/bookings/my-bookings");
    }

    if (!booking.user.equals(req.user._id)) {
      req.flash("error", "You don't have permission to cancel this booking");
      return res.redirect("/bookings/my-bookings");
    }

    if (booking.status === "cancelled") {
      req.flash("error", "Booking is already cancelled");
      return res.redirect(`/bookings/${id}`);
    }

    booking.status = "cancelled";
    await booking.save();

    req.flash("success", "Booking cancelled successfully");
    res.redirect(`/bookings/${id}`);
  } catch (error) {
    console.error("Error cancelling booking:", error);
    req.flash("error", "Unable to cancel booking");
    res.redirect("back");
  }
};
