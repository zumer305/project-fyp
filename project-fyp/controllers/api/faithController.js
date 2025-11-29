module.exports.mosques = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    // Stubbed nearby mosques; in future integrate a real Places API
    return res.json({
      coords: { lat: Number(lat) || null, lon: Number(lon) || null },
      items: [
        { name: "Central Mosque", distanceKm: 1.2 },
        { name: "City Mosque", distanceKm: 2.8 },
      ],
    });
  } catch {
    return res.status(500).json({ message: "Lookup failed" });
  }
};

module.exports.qiblah = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    // Simple placeholder angle; replace with proper calculation
    const angle = 293.0; // degrees from North
    return res.json({
      coords: { lat: Number(lat) || null, lon: Number(lon) || null },
      angle,
    });
  } catch {
    return res.status(500).json({ message: "Qiblah calc failed" });
  }
};

module.exports.halal = async (req, res) => {
  try {
    const { lat, lon, country, city } = req.query;
    // If country or city provided, return sample halal places for that area
    if (country || city) {
      const locName = city || country || "this destination";
      return res.json({
        area: locName,
        items: [
          {
            name: `${locName} Halal Bistro`,
            note: "Popular local spot",
            distanceKm: null,
          },
          {
            name: `${locName} Kebab House`,
            note: "Highly rated",
            distanceKm: null,
          },
        ],
      });
    }

    // Fallback: use lat/lon if provided (stubbed distances)
    return res.json({
      coords: { lat: Number(lat) || null, lon: Number(lon) || null },
      items: [
        { name: "Halal Grill", distanceKm: 0.9 },
        { name: "Osh & Kebabs", distanceKm: 1.7 },
      ],
    });
  } catch {
    return res.status(500).json({ message: "Halal locator failed" });
  }
};
