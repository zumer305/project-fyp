const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taxiFareSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "Standard",
        "Economy",
        "Comfort",
        "Comfort+",
        "Budget",
        "Mini",
        "Shared",
        "Business",
        "Premier",
        "Standard Night",
        "Student",
        "SUV/MPV",
        "Van",
        "Standard Metered",
      ],
    },
    capacity: {
      type: String,
      required: true,
    },
    baseFare: {
      type: Number,
      required: true,
      min: 0,
    },
    perKm: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    emoji: {
      type: String,
      default: "🚗",
    },
    features: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    region: {
      type: String,
      default: "Central Asia",
    },
    country: {
      type: String,
      default: "Central Asia",
    },
    city: {
      type: String,
      default: "",
    },
    currency: {
      type: String,
      default: "USD",
    },
    waitingCharge: {
      type: Number,
      min: 0,
      default: 0,
    },
    originalBaseFare: {
      type: Number,
      min: 0,
    },
    originalPerKm: {
      type: Number,
      min: 0,
    },
    originalWaiting: {
      type: Number,
      min: 0,
    },
    minimumTrip: {
      type: Number,
      min: 0,
    },
    perKmRange: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const TaxiFare = mongoose.model("TaxiFare", taxiFareSchema);
module.exports = TaxiFare;
