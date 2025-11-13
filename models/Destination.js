const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
  name: { type: String },
  region: { type: String },
  country: { type: String, index: true },
  type: { type: String },
  description: { type: String },
  minBudget: { type: Number },
  maxBudget: { type: Number },
  typicalDuration: { type: Number },
  climate: { type: String },
  coords: {
    lat: { type: Number },
    lon: { type: Number }
  },
  attractions: [{ type: String }],
  shopping: [{ type: String }],
  hotels: [{
    name: String,
    address: String,
    phone: String,
    rating: Number,
    priceRange: String
  }],
  emergencyContacts: [{
    type: { type: String },
    name: String,
    phone: String,
    address: String
  }],
  tags: [{ type: String, index: true }],
  images: [{ type: String }],
  weather: {
    current: { type: String },
    forecast: { type: String },
  }
}, { timestamps: true });

const Destination = mongoose.model("Destination", destinationSchema);
module.exports = Destination;
