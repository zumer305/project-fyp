const express = require("express");
const router = express.Router();
const bookings = require("../controllers/bookings");
const { isLoggedIn } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

// Show booking form
router.get("/book", isLoggedIn, wrapAsync(bookings.renderBookingForm));

// Create booking
router.post("/book", isLoggedIn, wrapAsync(bookings.createBooking));

// Show user's bookings
router.get(
  "/bookings/my-bookings",
  isLoggedIn,
  wrapAsync(bookings.showMyBookings)
);

// Show specific booking
router.get("/bookings/:id", isLoggedIn, wrapAsync(bookings.showBooking));

// Cancel booking
router.post(
  "/bookings/:id/cancel",
  isLoggedIn,
  wrapAsync(bookings.cancelBooking)
);

// Admin status update via secure token link (used in admin notification email)
router.get(
  "/bookings/:id/admin-status",
  wrapAsync(bookings.adminUpdateStatus)
);

module.exports = router;
