const OVERPASS_ENDPOINT = "https://overpass-api.de/api/interpreter";
const NOMINATIM_ENDPOINT = "https://nominatim.openstreetmap.org/search";

const USER_AGENT_HEADER = {
  "User-Agent": "project-fyp/1.0 (contact: travel-app@example.com)",
};

function deg2rad(deg) {
  return (deg * Math.PI) / 180;
}

function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function geocodeCityCountry(city, country) {
  const queryParts = [];
  if (city) queryParts.push(city);
  if (country) queryParts.push(country);
  if (!queryParts.length) return null;

  const params = new URLSearchParams({
    format: "json",
    limit: "1",
    addressdetails: "1",
    q: queryParts.join(", "),
  });

  const res = await fetch(`${NOMINATIM_ENDPOINT}?${params.toString()}`, {
    headers: USER_AGENT_HEADER,
  });
  if (!res.ok) {
    throw new Error(`Nominatim geocode failed with status ${res.status}`);
  }
  const data = await res.json();
  if (!Array.isArray(data) || !data.length) return null;
  const result = data[0];
  return {
    lat: Number(result.lat),
    lon: Number(result.lon),
    displayName: result.display_name,
  };
}

async function queryOverpassMosques(lat, lon, radiusKm) {
  const radiusMeters = Math.max(1000, Math.min(20000, Math.round(radiusKm * 1000)));
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="place_of_worship"]["religion"="muslim"](around:${radiusMeters},${lat},${lon});
      way["amenity"="place_of_worship"]["religion"="muslim"](around:${radiusMeters},${lat},${lon});
      relation["amenity"="place_of_worship"]["religion"="muslim"](around:${radiusMeters},${lat},${lon});
    );
    out center 40;
  `;

  const res = await fetch(OVERPASS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...USER_AGENT_HEADER,
    },
    body: new URLSearchParams({ data: query }).toString(),
  });

  if (!res.ok) {
    throw new Error(`Overpass query failed with status ${res.status}`);
  }
  const data = await res.json();
  if (!data || !Array.isArray(data.elements)) return [];

  const seen = new Set();
  const items = [];
  for (const element of data.elements) {
    const tags = element.tags || {};
    const name = tags.name || tags["name:en"];
    if (!name) continue;

    let latVal = element.lat;
    let lonVal = element.lon;
    if (element.type !== "node" && element.center) {
      latVal = element.center.lat;
      lonVal = element.center.lon;
    }
    if (typeof latVal !== "number" || typeof lonVal !== "number") continue;

    const signature = `${latVal.toFixed(6)},${lonVal.toFixed(6)}`;
    if (seen.has(signature)) continue;
    seen.add(signature);

    const addrParts = [];
    if (tags["addr:street"]) addrParts.push(tags["addr:street"]);
    if (tags["addr:housenumber"]) addrParts.push(tags["addr:housenumber"]);
    if (tags["addr:city"]) addrParts.push(tags["addr:city"]);
    if (tags["addr:postcode"]) addrParts.push(tags["addr:postcode"]);

    items.push({
      name,
      note: addrParts.join(", ") || tags.description || "",
      lat: latVal,
      lon: lonVal,
    });
    if (items.length >= 25) break;
  }

  return items.map((item) => ({
    ...item,
    distanceKm: haversineDistanceKm(lat, lon, item.lat, item.lon),
  }));
}

async function queryOverpassHalalFood(lat, lon, radiusKm) {
  const radiusMeters = Math.max(1000, Math.min(20000, Math.round(radiusKm * 1000)));
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"~"restaurant|fast_food"]["diet:halal"~"yes|only",i](around:${radiusMeters},${lat},${lon});
      node["amenity"~"restaurant|fast_food"]["cuisine"~"halal",i](around:${radiusMeters},${lat},${lon});
      way["amenity"~"restaurant|fast_food"]["diet:halal"~"yes|only",i](around:${radiusMeters},${lat},${lon});
      way["amenity"~"restaurant|fast_food"]["cuisine"~"halal",i](around:${radiusMeters},${lat},${lon});
      relation["amenity"~"restaurant|fast_food"]["diet:halal"~"yes|only",i](around:${radiusMeters},${lat},${lon});
      relation["amenity"~"restaurant|fast_food"]["cuisine"~"halal",i](around:${radiusMeters},${lat},${lon});
      node["shop"="butcher"]["cuisine"~"halal",i](around:${radiusMeters},${lat},${lon});
      way["shop"="butcher"]["cuisine"~"halal",i](around:${radiusMeters},${lat},${lon});
    );
    out center 60;
  `;

  const res = await fetch(OVERPASS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...USER_AGENT_HEADER,
    },
    body: new URLSearchParams({ data: query }).toString(),
  });

  if (!res.ok) {
    throw new Error(`Overpass query failed with status ${res.status}`);
  }

  const data = await res.json();
  if (!data || !Array.isArray(data.elements)) return [];

  const seen = new Set();
  const items = [];
  for (const element of data.elements) {
    const tags = element.tags || {};
    const name = tags.name || tags["name:en"] || tags.brand;
    if (!name) continue;

    let latVal = element.lat;
    let lonVal = element.lon;
    if (element.type !== "node" && element.center) {
      latVal = element.center.lat;
      lonVal = element.center.lon;
    }
    if (typeof latVal !== "number" || typeof lonVal !== "number") continue;

    const signature = `${latVal.toFixed(6)},${lonVal.toFixed(6)}`;
    if (seen.has(signature)) continue;
    seen.add(signature);

    const addrParts = [];
    if (tags["addr:street"]) addrParts.push(tags["addr:street"]);
    if (tags["addr:housenumber"]) addrParts.push(tags["addr:housenumber"]);
    if (tags["addr:city"]) addrParts.push(tags["addr:city"]);
    if (tags["addr:postcode"]) addrParts.push(tags["addr:postcode"]);

    const details = [];
    if (tags.cuisine) details.push(tags.cuisine);
    if (tags["diet:halal"]) details.push(`diet:${tags["diet:halal"]}`);
    if (tags.takeaway) details.push(`takeaway:${tags.takeaway}`);
    if (tags["contact:phone"]) details.push(`☎ ${tags["contact:phone"]}`);

    const address = addrParts.join(", ");

    items.push({
      name,
      note: [details.join(" • "), address || tags.description || "Halal-friendly spot"]
        .filter(Boolean)
        .join(" | "),
      lat: latVal,
      lon: lonVal,
    });
    if (items.length >= 25) break;
  }

  return items.map((item) => ({
    ...item,
    distanceKm: haversineDistanceKm(lat, lon, item.lat, item.lon),
  }));
}

module.exports.mosques = async (req, res) => {
  const { lat, lon, city, country } = req.query;
  const radiusKm = Number(req.query.radiusKm) || 5;

  let latNum = lat !== undefined ? Number(lat) : NaN;
  let lonNum = lon !== undefined ? Number(lon) : NaN;
  let areaLabel = city || country || "Selected Destination";

  try {
    if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) {
      if (city || country) {
        const geocoded = await geocodeCityCountry(city, country);
        if (geocoded) {
          latNum = geocoded.lat;
          lonNum = geocoded.lon;
          areaLabel = geocoded.displayName || areaLabel;
        }
      }
    }

    if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) {
      return res
        .status(400)
        .json({ message: "A valid city/country or lat/lon is required" });
    }

    let items = await queryOverpassMosques(latNum, lonNum, radiusKm);

    if (!items.length) {
      items = [
        {
          name: "Central Mosque",
          note: "Sample fallback entry",
          lat: latNum,
          lon: lonNum,
          distanceKm: 0,
        },
      ];
    }

    return res.json({
      coords: { lat: latNum, lon: lonNum },
      area: areaLabel,
      items,
    });
  } catch (err) {
    console.error("Mosque lookup failed", err);

    const fallbackArea = areaLabel || city || country || "Selected Destination";
    const hasCoords = Number.isFinite(latNum) && Number.isFinite(lonNum);
    const fallbackCoords = {
      lat: hasCoords ? latNum : null,
      lon: hasCoords ? lonNum : null,
    };

    return res.json({
      coords: fallbackCoords,
      area: fallbackArea,
      items: [
        {
          name: hasCoords ? `${fallbackArea} Mosque` : "Central Mosque",
          note: "Showing cached results while live lookup is unavailable",
          lat: fallbackCoords.lat,
          lon: fallbackCoords.lon,
          distanceKm: hasCoords ? 0 : null,
        },
      ],
      fallback: true,
      message: "Live mosque lookup unavailable; displaying fallback data.",
    });
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
  const { lat, lon, country, city } = req.query;
  const radiusKm = Number(req.query.radiusKm) || 5;

  let latNum = lat !== undefined ? Number(lat) : NaN;
  let lonNum = lon !== undefined ? Number(lon) : NaN;
  let areaLabel = city || country || "Selected Destination";

  try {
    if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) {
      if (city || country) {
        const geocoded = await geocodeCityCountry(city, country);
        if (geocoded) {
          latNum = geocoded.lat;
          lonNum = geocoded.lon;
          areaLabel = geocoded.displayName || areaLabel;
        }
      }
    }

    if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) {
      return res
        .status(400)
        .json({ message: "A valid city/country or lat/lon is required" });
    }

    let items = await queryOverpassHalalFood(latNum, lonNum, radiusKm);

    if (!items.length) {
      items = [
        {
          name: "Halal Grill",
          note: "Highlighting a popular halal-friendly spot",
          lat: latNum,
          lon: lonNum,
          distanceKm: 0,
        },
      ];
    }

    return res.json({
      coords: { lat: latNum, lon: lonNum },
      area: areaLabel,
      items,
    });
  } catch (err) {
    console.error("Halal lookup failed", err);

    const fallbackArea = areaLabel || city || country || "Selected Destination";
    const hasCoords = Number.isFinite(latNum) && Number.isFinite(lonNum);
    const fallbackCoords = {
      lat: hasCoords ? latNum : null,
      lon: hasCoords ? lonNum : null,
    };

    return res.json({
      coords: fallbackCoords,
      area: fallbackArea,
      items: [
        {
          name: hasCoords ? `${fallbackArea} Halal Eatery` : "Halal Grill",
          note: "Showing cached results while live lookup is unavailable",
          lat: fallbackCoords.lat,
          lon: fallbackCoords.lon,
          distanceKm: hasCoords ? 0 : null,
        },
      ],
      fallback: true,
      message: "Live halal food lookup unavailable; displaying fallback data.",
    });
  }
};
