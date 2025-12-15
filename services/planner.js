const fs = require("fs");
const path = require("path");
const {
  calculatePackagePrice: calculateRealisticPrice,
} = require("./pricing.js");

// Simple CSV parser that handles quoted fields and commas
function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];
  const header = splitCSVLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCSVLine(lines[i]);
    const obj = {};
    for (let j = 0; j < header.length; j++) {
      obj[header[j]] = cols[j] || "";
    }
    rows.push(obj);
  }
  return rows;
}

function splitCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result.map((v) => v.trim());
}

let DATA_CACHE = null;
function loadDataset() {
  if (DATA_CACHE) return DATA_CACHE;
  // Point to dataset inside project-fyp/dataset
  const datasetPath = path.join(
    __dirname,
    "..",
    "project-fyp",
    "dataset",
    "central_asia_travel_dataset_500.csv"
  );
  if (!fs.existsSync(datasetPath)) {
    console.warn("Dataset file not found:", datasetPath);
    DATA_CACHE = [];
    return DATA_CACHE;
  }
  const content = fs.readFileSync(datasetPath, "utf8");
  DATA_CACHE = parseCSV(content);
  return DATA_CACHE;
}

function normalize(str) {
  return (str || "").toLowerCase().trim();
}

// Old pricing functions removed - now using services/pricing.js

function pickCityRows(data, country) {
  const cNorm = normalize(country);
  return data.filter((r) => normalize(r.country) === cNorm);
}

function coerceInt(val, fallback) {
  const n = parseInt(val, 10);
  return Number.isFinite(n) ? n : fallback;
}

async function makePackageFromRow(row, budgetLevel, durationDays, index) {
  const days = coerceInt(row.suggested_days, durationDays || 5);
  const country = row.country || "Kyrgyzstan";
  const city = row.city || country;

  // Create unique package ID for stable pricing
  const packageId = `${country}_${city}_${row.category || "trip"}_${index}`;

  // Calculate realistic price using new pricing model
  const pricingResult = await calculateRealisticPrice(
    country,
    budgetLevel,
    days,
    packageId
  );
  const priceUSD = pricingResult.priceUSD;
  const breakdown = pricingResult.breakdownUSD;

  const attractions = (row.attractions || "")
    .split(/\s*;\s*|\s*,\s*/)
    .filter(Boolean);
  const muslimFeatures = [];
  if (row.halal_info) muslimFeatures.push(row.halal_info);
  if (row.tags && /mosque|qibla|prayer/i.test(row.tags))
    muslimFeatures.push("Mosque & Qibla guidance");

  return {
    country: country,
    city: city,
    name: `${city} ${row.category || "Trip"}`,
    price: priceUSD,
    priceUSD: priceUSD,
    totalEstimateUSD: priceUSD, // Total cost of the entire trip
    durationDays: days,
    duration: `${days} Days`,
    breakdown: breakdown,
    breakdownUSD: breakdown, // Numeric breakdown in USD
    hotel: `Estimated hotel budget - $${breakdown.hotel} total`,
    food: `Halal-friendly meals - $${breakdown.food} total`,
    transport: `Local transport & airport transfers - $${breakdown.transport} total`,
    attractions: attractions.length
      ? attractions
      : [(row.response || "").slice(0, 120) + "..."],
    shopping: ["Local markets", "Souks & bazaars"],
    weather: {
      current: "Check live weather",
      forecast: row.best_time || "Best season varies",
    },
    muslimFeatures: muslimFeatures.length
      ? muslimFeatures
      : ["Halal options", "Nearby mosques", "Prayer time notifications"],
  };
}

async function fallbackPackage(country, budgetLevel, durationDays) {
  const days = durationDays || 5;
  const packageId = `${country}_fallback_${budgetLevel}`;
  const pricingResult = await calculateRealisticPrice(
    country || "Kyrgyzstan",
    budgetLevel,
    days,
    packageId
  );
  const priceUSD = pricingResult.priceUSD;
  const breakdown = pricingResult.breakdownUSD;

  return [
    {
      country: country || "Kyrgyzstan",
      name: `${country} Standard Package`,
      price: priceUSD,
      priceUSD: priceUSD,
      totalEstimateUSD: priceUSD, // Total cost of the entire trip
      durationDays: days,
      duration: `${days} Days`,
      breakdown: breakdown,
      breakdownUSD: breakdown, // Numeric breakdown in USD
      hotel: `Comfortable stay - $${breakdown.hotel}`,
      food: `Halal meals - $${breakdown.food}`,
      transport: `Transfers & local travel - $${breakdown.transport}`,
      attractions: ["City tour", "Cultural sites", "Local markets"],
      shopping: ["Traditional markets", "Local crafts"],
      weather: {
        current: "Check live weather",
        forecast: "Seasonal weather expected",
      },
      muslimFeatures: [
        "Halal food available",
        "Mosque locations provided",
        "Prayer time info",
      ],
    },
  ];
}

async function generatePackages({ country, budgetUSD, durationDays }) {
  const data = loadDataset();

  if (!country) {
    return await fallbackPackage("Kyrgyzstan", "mid", durationDays);
  }

  const rows = pickCityRows(data, country);
  if (!rows.length) {
    return await fallbackPackage(country, "mid", durationDays);
  }

  // Score and generate all possible packages
  const scored = rows.map((r, idx) => ({
    row: r,
    index: idx,
    score:
      (r.category && /itinerary|plan|package/i.test(r.category) ? 3 : 1) +
      (r.response && r.response.length > 200 ? 1 : 0) +
      (r.attractions ? r.attractions.split(/;|,/).length : 0),
  }));
  scored.sort((a, b) => b.score - a.score);

  // Generate packages for all budget levels
  const levels = ["budget", "mid", "luxury"];
  const packagesByCategory = {};

  // Generate packages for each budget level (async)
  for (const level of levels) {
    packagesByCategory[level] = [];
    for (let i = 0; i < Math.min(15, scored.length); i++) {
      const s = scored[i];
      const pkg = await makePackageFromRow(s.row, level, durationDays, s.index);
      packagesByCategory[level].push(pkg);
    }
    // Sort by price
    packagesByCategory[level].sort(
      (a, b) => a.totalEstimateUSD - b.totalEstimateUSD
    );
  }

  // If budgetUSD is provided, return 3-4 packages within budget
  if (budgetUSD && budgetUSD > 0) {
    const allPackages = [];

    // Collect all packages from all tiers
    levels.forEach((level) => {
      allPackages.push(...packagesByCategory[level]);
    });

    // Filter packages within budget
    const withinBudget = allPackages.filter(
      (p) => p.totalEstimateUSD <= budgetUSD
    );

    // Sort by price
    withinBudget.sort((a, b) => a.totalEstimateUSD - b.totalEstimateUSD);

    // If we have at least 3-4 packages within budget, return them
    if (withinBudget.length >= 3) {
      return withinBudget.slice(0, 4); // Return max 4 packages
    }

    // If fewer than 3 within budget, fill with nearest above-budget packages
    const aboveBudget = allPackages
      .filter((p) => p.totalEstimateUSD > budgetUSD)
      .sort((a, b) => a.totalEstimateUSD - b.totalEstimateUSD);

    const result = [...withinBudget];
    const needed = 4 - result.length;
    result.push(...aboveBudget.slice(0, needed));

    return result.slice(0, 4); // Ensure exactly 3-4 packages
  }

  // No budget filter - return 3 packages from budget tier by default
  return packagesByCategory["budget"].slice(0, 3);
}

module.exports = { generatePackages };
