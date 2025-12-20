const mongoose = require("mongoose");

const travelPackageSchema = new mongoose.Schema(
  {
    country: { type: String, index: true, required: true },
    city: { type: String, index: true, required: true },
    packageType: { type: String, index: true, required: true }, // Budget, Mid-Range, Luxury
    duration: { type: String }, // e.g., 4D/3N
    flights: { type: Number, default: 0 },
    hotel: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    attractions: { type: Number, default: 0 },
    shopping: { type: Number, default: 0 },
    misc: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

travelPackageSchema.index({ country: 1, city: 1, packageType: 1 }, { unique: true });

module.exports = mongoose.model("TravelPackage", travelPackageSchema);
