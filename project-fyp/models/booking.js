const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    packageDetails: {
      packageId: String,
      packageTitle: String,
      destination: String,
      country: String,
      duration: String,
      totalCost: Number,
      currency: {
        type: String,
        default: "USD",
      },
      // Store the complete package for reference
      fullPackage: Schema.Types.Mixed,
    },
    travelDates: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
    travelers: {
      adults: {
        type: Number,
        required: true,
        min: 1,
      },
      children: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    contactInfo: {
      fullName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      specialRequests: String,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    bookingReference: {
      type: String,
      unique: true,
    },
    adminNotes: String,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Generate booking reference before saving
bookingSchema.pre("save", function (next) {
  if (!this.bookingReference) {
    const timestamp = Date.now();
    const randomStr = Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase();
    this.bookingReference = `BK-${timestamp}-${randomStr}`;
    console.log(`📌 Generated booking reference: ${this.bookingReference}`);
  }
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
