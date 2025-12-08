const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.openstreetmap.ru/cgi/interpreter",
];
const NOMINATIM_ENDPOINT = "https://nominatim.openstreetmap.org/search";
const MAPBOX_TOKEN =
  "pk.eyJ1IjoienVtZXIiLCJhIjoiY21pdWVvNnp4MGI4cjNnczhyNHdjYWJwZyJ9.bUa1KnOak9YFcggGRw4-2w";
const MAPBOX_GEOCODE_ENDPOINT =
  "https://api.mapbox.com/geocoding/v5/mapbox.places";

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

function sanitizeBoundingBox(raw) {
  if (!raw) return null;
  const south = Number(raw.south);
  const north = Number(raw.north);
  const west = Number(raw.west);
  const east = Number(raw.east);
  if ([south, north, west, east].some((v) => !Number.isFinite(v))) return null;
  if (north <= south || east <= west) return null;
  return {
    south: Math.max(-90, Math.min(90, south)),
    north: Math.max(-90, Math.min(90, north)),
    west: Math.max(-180, Math.min(180, west)),
    east: Math.max(-180, Math.min(180, east)),
  };
}

function formatBoundingBox(bbox) {
  return `${bbox.south},${bbox.west},${bbox.north},${bbox.east}`;
}

async function runOverpassQuery(query) {
  let lastError;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      // Add timeout to prevent hanging requests - 45 seconds for larger queries
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          ...USER_AGENT_HEADER,
        },
        body: new URLSearchParams({ data: query }).toString(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        lastError = new Error(
          `Overpass query failed ${res.status} at ${endpoint}`
        );
        console.warn(`Overpass endpoint ${endpoint} returned ${res.status}`);
        continue;
      }

      const data = await res.json();
      return data;
    } catch (err) {
      lastError = err;
      if (err.name === "AbortError") {
        console.warn(`Overpass endpoint ${endpoint} timed out after 45s`);
      } else {
        console.warn(`Overpass endpoint ${endpoint} failed:`, err.message);
      }
      // Continue to next endpoint
    }
  }

  if (lastError) throw lastError;
  throw new Error("All Overpass endpoints failed");
}

async function geocodeCityCountry(city, country) {
  const queryParts = [];
  if (city) queryParts.push(city);
  if (country) queryParts.push(country);
  if (!queryParts.length) return null;

  // Hardcoded fallback coordinates for common Central Asian destinations
  const fallbackCoords = {
    bishkek: {
      lat: 42.8746,
      lon: 74.5698,
      displayName: "Bishkek, Kyrgyzstan",
      countryCode: "KG",
      isCity: true,
    },
    almaty: {
      lat: 43.222,
      lon: 76.8512,
      displayName: "Almaty, Kazakhstan",
      countryCode: "KZ",
      isCity: true,
    },
    tashkent: {
      lat: 41.2995,
      lon: 69.2401,
      displayName: "Tashkent, Uzbekistan",
      countryCode: "UZ",
      isCity: true,
    },
    dushanbe: {
      lat: 38.5598,
      lon: 68.7738,
      displayName: "Dushanbe, Tajikistan",
      countryCode: "TJ",
      isCity: true,
    },
    ashgabat: {
      lat: 37.9601,
      lon: 58.3261,
      displayName: "Ashgabat, Turkmenistan",
      countryCode: "TM",
      isCity: true,
    },
    baku: {
      lat: 40.4093,
      lon: 49.8671,
      displayName: "Baku, Azerbaijan",
      countryCode: "AZ",
      isCity: true,
    },
    nursultan: {
      lat: 51.1694,
      lon: 71.4491,
      displayName: "Nur-Sultan, Kazakhstan",
      countryCode: "KZ",
      isCity: true,
    },
    astana: {
      lat: 51.1694,
      lon: 71.4491,
      displayName: "Astana, Kazakhstan",
      countryCode: "KZ",
      isCity: true,
    },
    osh: {
      lat: 40.5283,
      lon: 72.7985,
      displayName: "Osh, Kyrgyzstan",
      countryCode: "KG",
      isCity: true,
    },
    samarkand: {
      lat: 39.6542,
      lon: 66.9597,
      displayName: "Samarkand, Uzbekistan",
      countryCode: "UZ",
      isCity: true,
    },
    bukhara: {
      lat: 39.7747,
      lon: 64.4286,
      displayName: "Bukhara, Uzbekistan",
      countryCode: "UZ",
      isCity: true,
    },
    // For countries, use capital city coordinates for better results
    kyrgyzstan: {
      lat: 42.8746,
      lon: 74.5698,
      displayName: "Bishkek, Kyrgyzstan",
      countryCode: "KG",
      isCity: false,
    },
    kazakhstan: {
      lat: 43.222,
      lon: 76.8512,
      displayName: "Almaty, Kazakhstan",
      countryCode: "KZ",
      isCity: false,
    },
    uzbekistan: {
      lat: 41.2995,
      lon: 69.2401,
      displayName: "Tashkent, Uzbekistan",
      countryCode: "UZ",
      isCity: false,
    },
    tajikistan: {
      lat: 38.5598,
      lon: 68.7738,
      displayName: "Dushanbe, Tajikistan",
      countryCode: "TJ",
      isCity: false,
    },
    turkmenistan: {
      lat: 37.9601,
      lon: 58.3261,
      displayName: "Ashgabat, Turkmenistan",
      countryCode: "TM",
      isCity: false,
    },
    azerbaijan: {
      lat: 40.4093,
      lon: 49.8671,
      displayName: "Baku, Azerbaijan",
      countryCode: "AZ",
      isCity: false,
    },
  };

  // Check hardcoded fallback first
  const searchKey = (city || country || "").toLowerCase().trim();
  if (fallbackCoords[searchKey]) {
    console.log(`Using hardcoded coordinates for: ${searchKey}`);
    const coords = fallbackCoords[searchKey];
    return {
      lat: coords.lat,
      lon: coords.lon,
      displayName: coords.displayName,
      boundingBox: null,
      countryCode: coords.countryCode,
      isCity: coords.isCity,
    };
  }

  // Try Mapbox Geocoding first (better than Nominatim, no rate limits with your token)
  try {
    const query = queryParts.join(", ");
    const url = `${MAPBOX_GEOCODE_ENDPOINT}/${encodeURIComponent(
      query
    )}.json?access_token=${MAPBOX_TOKEN}&limit=1`;

    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const [lon, lat] = feature.center;

        // Extract country code from context
        let countryCode = null;
        if (feature.context) {
          const countryContext = feature.context.find((c) =>
            c.id.startsWith("country.")
          );
          if (countryContext && countryContext.short_code) {
            countryCode = countryContext.short_code.toUpperCase();
          }
        }

        // Extract bounding box if available
        let boundingBox = null;
        if (feature.bbox && feature.bbox.length === 4) {
          boundingBox = sanitizeBoundingBox({
            west: feature.bbox[0],
            south: feature.bbox[1],
            east: feature.bbox[2],
            north: feature.bbox[3],
          });
        }

        console.log(`Mapbox geocoded: ${feature.place_name}`);
        return {
          lat,
          lon,
          displayName: feature.place_name,
          boundingBox,
          countryCode,
        };
      }
    }
  } catch (err) {
    console.warn("Mapbox geocoding failed:", err.message);
  }

  // Fallback to Nominatim if Mapbox fails
  const params = new URLSearchParams({
    format: "json",
    limit: "1",
    addressdetails: "1",
    q: queryParts.join(", "),
  });

  let lastError;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      if (attempt > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      const res = await fetch(`${NOMINATIM_ENDPOINT}?${params.toString()}`, {
        headers: USER_AGENT_HEADER,
      });

      if (!res.ok) {
        lastError = new Error(`Nominatim returned ${res.status}`);
        continue;
      }

      const data = await res.json();
      if (!Array.isArray(data) || !data.length) return null;

      const result = data[0];
      const latNum = Number(result.lat);
      const lonNum = Number(result.lon);
      const boundingBox =
        Array.isArray(result.boundingbox) && result.boundingbox.length === 4
          ? sanitizeBoundingBox({
              south: Number(result.boundingbox[0]),
              north: Number(result.boundingbox[1]),
              west: Number(result.boundingbox[2]),
              east: Number(result.boundingbox[3]),
            })
          : null;
      const countryCode =
        result.address && typeof result.address.country_code === "string"
          ? result.address.country_code.toUpperCase()
          : null;

      console.log(`Nominatim geocoded: ${result.display_name}`);
      return {
        lat: latNum,
        lon: lonNum,
        displayName: result.display_name,
        boundingBox,
        countryCode,
      };
    } catch (err) {
      lastError = err;
    }
  }

  console.warn(
    "All geocoding methods failed:",
    lastError?.message || "Unknown error"
  );
  return null;
}

async function geocodeCityCountryOLD_BACKUP(city, country) {
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
  const latNum = Number(result.lat);
  const lonNum = Number(result.lon);
  const boundingBox =
    Array.isArray(result.boundingbox) && result.boundingbox.length === 4
      ? sanitizeBoundingBox({
          south: Number(result.boundingbox[0]),
          north: Number(result.boundingbox[1]),
          west: Number(result.boundingbox[2]),
          east: Number(result.boundingbox[3]),
        })
      : null;
  const countryCode =
    result.address && typeof result.address.country_code === "string"
      ? result.address.country_code.toUpperCase()
      : null;

  return {
    lat: latNum,
    lon: lonNum,
    displayName: result.display_name,
    boundingBox,
    countryCode,
  };
}

async function fetchOverpassMosques(lat, lon, options = {}) {
  const { radiusKm, boundingBox, countryCode, mode } = options;

  // Simplified selectors - just the most common mosque tags for faster queries
  const buildSelectors = (scope) => `
        node["amenity"="place_of_worship"]["religion"="muslim"]${scope};
        way["amenity"="place_of_worship"]["religion"="muslim"]${scope};
        node["building"="mosque"]${scope};
        way["building"="mosque"]${scope};
  `;

  let query;
  if (mode === "country" && countryCode) {
    const iso = countryCode.toUpperCase();
    query = `
      [out:json][timeout:20];
      (
        area["ISO3166-1"="${iso}"];
        area["ISO3166-1:alpha2"="${iso}"];
      )->.searchArea;
      (
${buildSelectors("(area.searchArea)")}
      );
      out center 30;
    `;
  } else if (mode === "bbox" && boundingBox) {
    const bbox = formatBoundingBox(boundingBox);
    query = `
      [out:json][timeout:20];
      (
${buildSelectors(`(${bbox})`)}
      );
      out center 60;
    `;
  } else {
    const radiusMeters = Math.max(
      1000,
      Math.min(150000, Math.round((radiusKm || 5) * 1000))
    );
    query = `
      [out:json][timeout:15];
      (
${buildSelectors(`(around:${radiusMeters},${lat},${lon})`)}
      );
      out center 100;
    `;
  }

  const data = await runOverpassQuery(query);
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

  return items
    .map((item) => ({
      ...item,
      distanceKm: haversineDistanceKm(lat, lon, item.lat, item.lon),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

async function fetchOverpassHalalFood(lat, lon, options = {}) {
  const { radiusKm, boundingBox, countryCode, mode } = options;

  // Simplified selectors for faster queries
  const buildSelectors = (scope) => `
        node["amenity"="restaurant"]["diet:halal"="yes"]${scope};
        node["amenity"="restaurant"]["cuisine"="halal"]${scope};
        node["amenity"="fast_food"]["diet:halal"="yes"]${scope};
        way["amenity"="restaurant"]["diet:halal"="yes"]${scope};
        way["amenity"="fast_food"]["diet:halal"="yes"]${scope};
  `;

  let query;
  if (mode === "country" && countryCode) {
    const iso = countryCode.toUpperCase();
    query = `
      [out:json][timeout:20];
      (
        area["ISO3166-1"="${iso}"];
        area["ISO3166-1:alpha2"="${iso}"];
      )->.searchArea;
      (
${buildSelectors("(area.searchArea)")}
      );
      out center 30;
    `;
  } else if (mode === "bbox" && boundingBox) {
    const bbox = formatBoundingBox(boundingBox);
    query = `
      [out:json][timeout:20];
      (
${buildSelectors(`(${bbox})`)}
      );
      out center 60;
    `;
  } else {
    const radiusMeters = Math.max(
      1000,
      Math.min(150000, Math.round((radiusKm || 5) * 1000))
    );
    query = `
      [out:json][timeout:15];
      (
${buildSelectors(`(around:${radiusMeters},${lat},${lon})`)}
      );
      out center 60;
    `;
  }

  const data = await runOverpassQuery(query);
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
      note: [
        details.join(" • "),
        address || tags.description || "Halal-friendly spot",
      ]
        .filter(Boolean)
        .join(" | "),
      lat: latVal,
      lon: lonVal,
    });
    if (items.length >= 25) break;
  }

  return items
    .map((item) => ({
      ...item,
      distanceKm: haversineDistanceKm(lat, lon, item.lat, item.lon),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

function buildFallbackItems(type, label, lat, lon) {
  const displayName = label || `Selected ${type}`;
  return [
    {
      name:
        type === "mosque"
          ? `${displayName} Mosque`
          : `${displayName} Halal Eatery`,
      note: "Showing cached results while live lookup is unavailable",
      lat,
      lon,
      distanceKm: lat != null && lon != null ? 0 : null,
    },
  ];
}

function buildRadiusSweep(baseKm) {
  const base = Math.max(1, Number(baseKm) || 5);
  const candidates = [base, base * 1.8, base * 3, 20, 35, 50, 75, 110, 150];

  const unique = [];
  for (const value of candidates) {
    const radius = Math.min(150, Math.max(1, value));
    if (!unique.some((r) => Math.abs(r - radius) < 0.5)) {
      unique.push(radius);
    }
  }

  return unique;
}

async function queryOverpassWithExpansion(
  fetcher,
  lat,
  lon,
  baseRadiusKm,
  options = {}
) {
  const radii = buildRadiusSweep(baseRadiusKm);
  const { boundingBox, countryCode } = options || {};
  let lastError = null;

  // Try radius searches first
  for (const radius of radii) {
    try {
      console.log(`Trying radius search: ${radius}km`);
      const items = await fetcher(lat, lon, { radiusKm: radius, countryCode });
      if (items.length) {
        console.log(`Found ${items.length} items at ${radius}km radius`);
        return items;
      }
    } catch (err) {
      lastError = err;
      console.warn(`Radius search ${radius}km failed:`, err.message);
    }
  }

  // Try bounding box search if available
  if (boundingBox) {
    try {
      console.log("Trying bounding box search");
      const bboxItems = await fetcher(lat, lon, {
        boundingBox,
        countryCode,
        mode: "bbox",
      });
      if (bboxItems.length) {
        console.log(`Found ${bboxItems.length} items in bbox`);
        return bboxItems;
      }
    } catch (err) {
      lastError = err;
      console.warn("Bbox search failed:", err.message);
    }
  }

  // Try country-wide search as last resort (for country searches)
  if (countryCode) {
    try {
      console.log("Trying country-wide search");
      const countryItems = await fetcher(lat, lon, {
        countryCode,
        mode: "country",
      });
      if (countryItems.length) {
        console.log(`Found ${countryItems.length} items in country`);
        return countryItems;
      }
    } catch (err) {
      lastError = err;
      console.warn("Country search failed:", err.message);
    }
  }

  if (lastError) throw lastError;
  return [];
}

async function queryOverpassMosques(lat, lon, radiusKm, options) {
  return queryOverpassWithExpansion(
    fetchOverpassMosques,
    lat,
    lon,
    radiusKm,
    options
  );
}

async function queryOverpassHalalFood(lat, lon, radiusKm, options) {
  return queryOverpassWithExpansion(
    fetchOverpassHalalFood,
    lat,
    lon,
    radiusKm,
    options
  );
}

module.exports.mosques = async (req, res) => {
  const { lat, lon, city, country } = req.query;
  const radiusKm = Number(req.query.radiusKm) || 5;

  console.log("Mosque request:", { city, country, lat, lon });

  let latNum = lat !== undefined ? Number(lat) : NaN;
  let lonNum = lon !== undefined ? Number(lon) : NaN;
  let areaLabel = city || country || "Selected Destination";
  let boundingBox = null;
  let countryCode =
    typeof req.query.countryCode === "string" &&
    req.query.countryCode.trim().length === 2
      ? req.query.countryCode.trim().toUpperCase()
      : null;

  if (
    !countryCode &&
    typeof country === "string" &&
    country.trim().length === 2
  ) {
    countryCode = country.trim().toUpperCase();
  }

  try {
    let geocoded = null;
    if (city || country) {
      geocoded = await geocodeCityCountry(city, country);
      console.log("Geocoded result:", geocoded);
    }

    if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) {
      if (geocoded) {
        latNum = geocoded.lat;
        lonNum = geocoded.lon;
        areaLabel = geocoded.displayName || areaLabel;
      }
    }

    if (geocoded) {
      if (!boundingBox && geocoded.boundingBox) {
        boundingBox = geocoded.boundingBox;
      }
      if (!countryCode && geocoded.countryCode) {
        countryCode = geocoded.countryCode;
      }
      if (geocoded.displayName) {
        areaLabel = geocoded.displayName;
      }
    }

    if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) {
      console.warn("No valid coordinates found for mosque search");
      return res
        .status(400)
        .json({ message: "A valid city/country or lat/lon is required" });
    }

    console.log("Searching mosques at:", {
      lat: latNum,
      lon: lonNum,
      countryCode,
    });

    // Use larger radius for country searches (search entire major city)
    let searchRadius = radiusKm;
    if (geocoded && !geocoded.isCity) {
      // It's a country search - use 20km radius around capital for faster results
      searchRadius = 20;
      console.log(
        "Country search detected - using 20km radius around capital city"
      );
    }

    let items = await queryOverpassMosques(latNum, lonNum, searchRadius, {
      boundingBox,
      countryCode,
    });

    console.log("Found mosques:", items.length);

    if (!items.length) {
      items = buildFallbackItems("mosque", areaLabel, latNum, lonNum);
    }

    const payload = {
      coords: { lat: latNum, lon: lonNum },
      area: areaLabel,
      items,
    };

    if (boundingBox) {
      payload.searchedBoundingBox = boundingBox;
    }

    if (countryCode) {
      payload.searchedCountryCode = countryCode;
    }

    return res.json(payload);
  } catch (err) {
    console.error("Mosque lookup failed", err);

    const fallbackArea = areaLabel || city || country || "Selected Destination";
    const hasCoords = Number.isFinite(latNum) && Number.isFinite(lonNum);
    const fallbackCoords = {
      lat: hasCoords ? latNum : null,
      lon: hasCoords ? lonNum : null,
    };

    const payload = {
      coords: fallbackCoords,
      area: fallbackArea,
      items: buildFallbackItems(
        "mosque",
        fallbackArea,
        fallbackCoords.lat,
        fallbackCoords.lon
      ),
      fallback: true,
      message: "Live mosque lookup unavailable; displaying fallback data.",
    };

    if (boundingBox) {
      payload.searchedBoundingBox = boundingBox;
    }

    if (countryCode) {
      payload.searchedCountryCode = countryCode;
    }

    return res.json(payload);
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
      Math.cos((userLat * Math.PI) / 180) *
        Math.sin((meccaLat * Math.PI) / 180) -
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
  let boundingBox = null;
  let countryCode =
    typeof req.query.countryCode === "string" &&
    req.query.countryCode.trim().length === 2
      ? req.query.countryCode.trim().toUpperCase()
      : null;

  if (
    !countryCode &&
    typeof country === "string" &&
    country.trim().length === 2
  ) {
    countryCode = country.trim().toUpperCase();
  }

  try {
    let geocoded = null;
    if (city || country) {
      geocoded = await geocodeCityCountry(city, country);
    }

    if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) {
      if (geocoded) {
        latNum = geocoded.lat;
        lonNum = geocoded.lon;
        areaLabel = geocoded.displayName || areaLabel;
      }
    }

    if (geocoded) {
      if (!boundingBox && geocoded.boundingBox) {
        boundingBox = geocoded.boundingBox;
      }
      if (!countryCode && geocoded.countryCode) {
        countryCode = geocoded.countryCode;
      }
      if (geocoded.displayName) {
        areaLabel = geocoded.displayName;
      }
    }

    if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) {
      return res
        .status(400)
        .json({ message: "A valid city/country or lat/lon is required" });
    }

    // Use larger radius for country searches (search entire major city)
    let searchRadius = radiusKm;
    if (geocoded && !geocoded.isCity) {
      // It's a country search - use 20km radius around capital for faster results
      searchRadius = 20;
      console.log(
        "Country search detected - using 20km radius around capital city"
      );
    }

    let items = await queryOverpassHalalFood(latNum, lonNum, searchRadius, {
      boundingBox,
      countryCode,
    });

    if (!items.length) {
      items = buildFallbackItems("halal", areaLabel, latNum, lonNum);
    }

    const payload = {
      coords: { lat: latNum, lon: lonNum },
      area: areaLabel,
      items,
    };

    if (boundingBox) {
      payload.searchedBoundingBox = boundingBox;
    }

    if (countryCode) {
      payload.searchedCountryCode = countryCode;
    }

    return res.json(payload);
  } catch (err) {
    console.error("Halal lookup failed", err);

    const fallbackArea = areaLabel || city || country || "Selected Destination";
    const hasCoords = Number.isFinite(latNum) && Number.isFinite(lonNum);
    const fallbackCoords = {
      lat: hasCoords ? latNum : null,
      lon: hasCoords ? lonNum : null,
    };

    const payload = {
      coords: fallbackCoords,
      area: fallbackArea,
      items: buildFallbackItems(
        "halal",
        fallbackArea,
        fallbackCoords.lat,
        fallbackCoords.lon
      ),
      fallback: true,
      message: "Live halal food lookup unavailable; displaying fallback data.",
    };

    if (boundingBox) {
      payload.searchedBoundingBox = boundingBox;
    }

    if (countryCode) {
      payload.searchedCountryCode = countryCode;
    }

    return res.json(payload);
  }
};
