const Destination = require("../../models/Destination.js");

module.exports.nearby = async (req, res) => {
  try {
    const { lat, lon, type, destId } = req.query;
    if (destId) {
      const d = await Destination.findById(destId).select("hotels coords");
      if (!d) return res.status(404).json({ message: "Destination not found" });
      return res.json({ hotels: d.hotels || [], coords: d.coords });
    }
    // Fallback: no external maps integration; return empty with coords
    return res.json({ hotels: [], coords: { lat: Number(lat) || null, lon: Number(lon) || null }, type: type || "hotel" });
  } catch (e) {
    return res.status(500).json({ message: "Nearby lookup failed" });
  }
};