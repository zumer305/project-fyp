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
      enum: ["Standard", "Economy", "Comfort", "Budget", "Mini", "Shared"],
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
  },
  {
    timestamps: true,
  }
);

const TaxiFare = mongoose.model("TaxiFare", taxiFareSchema);
module.exports = TaxiFare;
