const fs = require("fs");
const path = require("path");

// Simple CSV parser that handles quoted fields and commas
function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
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
  return result.map(v => v.trim());
}

let DATA_CACHE = null;
function loadDataset() {
  if (DATA_CACHE) return DATA_CACHE;
  // Point to dataset inside project-fyp/dataset
  const datasetPath = path.join(__dirname, "..", "project-fyp", "dataset", "central_asia_travel_dataset_500.csv");
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

function budgetBreakdown(total) {
  const t = Math.max(0, Number(total) || 0);
  return {
    hotel: Math.round(t * 0.4),
    food: Math.round(t * 0.2),
    transport: Math.round(t * 0.15),
    attractions: Math.round(t * 0.15),
    shopping: Math.round(t * 0.1),
  };
}

function pickCityRows(data, country) {
  const cNorm = normalize(country);
  return data.filter(r => normalize(r.country) === cNorm);
}

function coerceInt(val, fallback) {
  const n = parseInt(val, 10);
  return Number.isFinite(n) ? n : fallback;
}

function makePackageFromRow(row, budget, durationDays) {
  const days = coerceInt(row.suggested_days, durationDays || 5);
  const breakdown = budgetBreakdown(budget);
  const attractions = (row.attractions || "").split(/\s*;\s*|\s*,\s*/).filter(Boolean);
  const muslimFeatures = [];
  if (row.halal_info) muslimFeatures.push(row.halal_info);
  if (row.tags && /mosque|qibla|prayer/i.test(row.tags)) muslimFeatures.push("Mosque & Qibla guidance");

  return {
    name: `${row.city || row.country} ${row.category || "Trip"}`,
    price: budget,
    duration: `${days} Days`,
    hotel: `Estimated hotel budget - $${breakdown.hotel} total`,
    food: `Halal-friendly meals - $${breakdown.food} total`,
    transport: `Local transport & airport transfers - $${breakdown.transport} total`,
    attractions: attractions.length ? attractions : [(row.response || "").slice(0, 120) + "..."],
    shopping: ["Local markets", "Souks & bazaars"],
    weather: { current: "Check live weather", forecast: row.best_time || "Best season varies" },
    muslimFeatures: muslimFeatures.length ? muslimFeatures : ["Halal options", "Nearby mosques", "Prayer time notifications"],
  };
}

function fallbackPackage(country, budget, durationDays) {
  const days = durationDays || 5;
  const breakdown = budgetBreakdown(budget);
  return [{
    name: `${country} Standard Package`,
    price: budget,
    duration: `${days} Days`,
    hotel: `Comfortable stay - $${breakdown.hotel}`,
    food: `Halal meals - $${breakdown.food}`,
    transport: `Transfers & local travel - $${breakdown.transport}`,
    attractions: ["City tour", "Cultural sites", "Local markets"],
    shopping: ["Traditional markets", "Local crafts"],
    weather: { current: "Check live weather", forecast: "Seasonal weather expected" },
    muslimFeatures: ["Halal food available", "Mosque locations provided", "Prayer time info"],
  }];
}

function generatePackages({ country, budget, durationDays }) {
  const data = loadDataset();
  if (!country || !budget) return fallbackPackage(country || "Destination", budget || 0, durationDays);
  const rows = pickCityRows(data, country);
  if (!rows.length) return fallbackPackage(country, budget, durationDays);

  // Prefer rows that look itinerary-like
  const scored = rows.map(r => ({
    row: r,
    score: (r.category && /itinerary|plan|package/i.test(r.category) ? 3 : 1) +
           (r.response && r.response.length > 200 ? 1 : 0) +
           (r.attractions ? r.attractions.split(/;|,/).length : 0)
  }));
  scored.sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 3).map(s => makePackageFromRow(s.row, budget, durationDays));
  return top.length ? top : fallbackPackage(country, budget, durationDays);
}

module.exports = { generatePackages };