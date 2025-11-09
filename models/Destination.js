import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
  region: String,
  country: String,
  minBudget: Number,
  maxBudget: Number,
  hotel: Number,
  food: Number,
  transport: Number,
  attractions: [String],
  shopping: [String],
  weather: {
    current: String,
    forecast: String,
  },
});

const Destination = mongoose.model("Destination", destinationSchema);
export default Destination;
