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
    const userLat = Number(lat);
    const userLon = Number(lon);

    // Mecca coordinates
    const meccaLat = 21.4225;
    const meccaLon = 39.8262;

    // Calculate bearing from user location to Mecca
    // Formula: θ = atan2( sin Δλ ⋅ cos φ2 , cos φ1 ⋅ sin φ2 − sin φ1 ⋅ cos φ2 ⋅ cos Δλ )
    const dLon = (meccaLon - userLon) * (Math.PI / 180);
    const y = Math.sin(dLon) * Math.cos((meccaLat * Math.PI) / 180);
    const x =
      Math.cos((userLat * Math.PI) / 180) * Math.sin((meccaLat * Math.PI) / 180) -
      Math.sin((userLat * Math.PI) / 180) *
        Math.cos((meccaLat * Math.PI) / 180) *
        Math.cos(dLon);

    let angle = Math.atan2(y, x) * (180 / Math.PI);
    // Normalize to 0-360 range
    angle = (angle + 360) % 360;

    return res.json({
      coords: { lat: userLat || null, lon: userLon || null },
      angle: parseFloat(angle.toFixed(1)),
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
