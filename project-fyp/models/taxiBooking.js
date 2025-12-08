const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taxiBookingSchema = new Schema({
  vehicle: {
    type: String,
    required: true,
  },
  fare: {
    type: Number,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Completed", "Cancelled"],
    default: "Pending",
  },
  driver: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  acceptedAt: Date,
  completedAt: Date,
});

module.exports = mongoose.model("TaxiBooking", taxiBookingSchema);
