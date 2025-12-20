/**
 * Realistic Pricing Model for Travel Packages
 * All prices from actual pricing tables (6 countries × 3 cities × 3 tiers = 54 packages)
 */

const fs = require("fs");
const path = require("path");
const { convertCurrency } = require("../project-fyp/utils/currencyHelper.js");

const FALLBACK_PKR_PER_USD = 278;
const PACKAGES_FILE = path.join(
  __dirname,
  "..",
  "project-fyp",
  "dataset",
  "central_asia_travel_packages.txt"
);

let PRICING_DATABASE = null;
let MIN_PKR_THRESHOLD = 100000;

function normalizeTier(tier) {
  if (!tier) return "mid";
  const t = tier.toLowerCase();
  if (t.startsWith("mid")) return "mid";
  if (t.startsWith("lux")) return "luxury";
  return "budget";
}

function parsePackagesFile() {
  if (!fs.existsSync(PACKAGES_FILE)) {
    throw new Error(`Packages file not found: ${PACKAGES_FILE}`);
  }

  const content = fs.readFileSync(PACKAGES_FILE, "utf8").trim();
  const lines = content.split(/\r?\n/).filter(Boolean);
  if (lines.length <= 1) {
    throw new Error("Packages file is empty or missing data rows");
  }

  const table = {};
  let minPKR = Number.POSITIVE_INFINITY;

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((v) => v.trim());
    if (cols.length < 12) continue;

    const [
      country,
      city,
      packageType,
      daysNights,
      flights,
      hotel,
      food,
      transport,
      attractions,
      shopping,
      misc,
      total,
    ] = cols;

    const tierKey = normalizeTier(packageType);
    const days = parseInt(daysNights, 10) || parseInt((daysNights || "").split("D")[0], 10) || 5;

    const entry = {
      price_pkr: parseInt(total, 10),
      days,
      breakdown: {
        flights: parseInt(flights, 10),
        hotel: parseInt(hotel, 10),
        food: parseInt(food, 10),
        transport: parseInt(transport, 10),
        attractions: parseInt(attractions, 10),
        shopping: parseInt(shopping, 10),
        misc: parseInt(misc, 10),
      },
    };

    if (!table[country]) table[country] = {};
    if (!table[country][city]) table[country][city] = {};
    table[country][city][tierKey] = entry;

    if (Number.isFinite(entry.price_pkr)) {
      minPKR = Math.min(minPKR, entry.price_pkr);
    }
  }

  return {
    table,
    minPKR: Number.isFinite(minPKR) ? minPKR : MIN_PKR_THRESHOLD,
  };
}

function getPricingTable() {
  if (PRICING_DATABASE) return PRICING_DATABASE;
  const { table, minPKR } = parsePackagesFile();
  PRICING_DATABASE = table;
  MIN_PKR_THRESHOLD = minPKR;
  return PRICING_DATABASE;
}

// Preload pricing table so exports reflect file values immediately
try {
  getPricingTable();
} catch (error) {
  console.warn("Failed to preload pricing table:", error.message);
}

function resolveCity(countryData, city, packageId) {
  if (city && countryData[city]) return city;
  if (packageId) {
    const parts = packageId.split("_");
    if (parts.length > 1 && countryData[parts[1]]) {
      return parts[1];
    }
  }
  return Object.keys(countryData)[0];
}

function getPackageEntry(country, tier, city, packageId) {
  const pricingTable = getPricingTable();
  const countryData = pricingTable[country];
  if (!countryData) {
    throw new Error(`No pricing found for country: ${country}`);
  }
  const resolvedCity = resolveCity(countryData, city, packageId);
  const cityData = countryData[resolvedCity];
  if (!cityData) {
    throw new Error(`No pricing found for city: ${resolvedCity} in ${country}`);
  }
  const normalizedTier = normalizeTier(tier);
  const pkg = cityData[normalizedTier];
  if (!pkg) {
    throw new Error(
      `No pricing found for tier: ${normalizedTier} in ${resolvedCity}, ${country}`
    );
  }
  return { pkg, city: resolvedCity, tier: normalizedTier };
}

/**
 * List all packages for a country with total PKR <= maxPKR (from TXT table)
 * Returns array of { country, city, tier, days, price_pkr, breakdown }
 */
function listPackagesUnderBudget(country, maxPKR) {
  const table = getPricingTable();
  const countryData = table[country];
  if (!countryData) return [];

  const results = [];
  for (const city of Object.keys(countryData)) {
    const tiers = countryData[city] || {};
    for (const tier of Object.keys(tiers)) {
      const pkg = tiers[tier];
      if (!pkg || !Number.isFinite(pkg.price_pkr)) continue;
      if (pkg.price_pkr <= maxPKR) {
        results.push({
          country,
          city,
          tier,
          days: pkg.days,
          price_pkr: pkg.price_pkr,
          breakdown: { ...pkg.breakdown },
        });
      }
    }
  }

  // Sort by total price ascending
  results.sort((a, b) => a.price_pkr - b.price_pkr);
  return results;
}

// Cache for PKR exchange rate
let pkrRateCache = {
  rate: FALLBACK_PKR_PER_USD,
  timestamp: null,
  expiry: 60 * 60 * 1000, // 1 hour
};

/**
 * Get PKR per USD exchange rate (cached)
 */
async function getPKRPerUSD() {
  const now = Date.now();

  // Check if cache is valid
  if (
    pkrRateCache.timestamp &&
    now - pkrRateCache.timestamp < pkrRateCache.expiry
  ) {
    return pkrRateCache.rate;
  }

  // Try to fetch fresh rate
  try {
    console.log("Fetching fresh PKR exchange rate...");
    const rate = await convertCurrency(1, "USD", "PKR");

    // Check if rate is realistic (Frankfurt doesn't support PKR, so it returns 1)
    if (rate && rate > 1 && rate !== 1) {
      pkrRateCache.rate = rate;
      pkrRateCache.timestamp = now;
      console.log(`PKR rate updated: 1 USD = ${rate} PKR`);
      return rate;
    } else {
      // Rate is 1:1, which means PKR is not supported
      console.warn("PKR not supported by Frankfurter, using fallback rate");
    }
  } catch (error) {
    console.warn("Failed to fetch PKR rate:", error.message);
  }

  // Always use the fallback rate for PKR since Frankfurter doesn't support it
  console.log(`Using fallback PKR rate: 1 USD = ${FALLBACK_PKR_PER_USD} PKR`);
  pkrRateCache.rate = FALLBACK_PKR_PER_USD;
  pkrRateCache.timestamp = now;
  return pkrRateCache.rate;
}

/**
 * Calculate realistic package price
 *
 * @param {string} country - Country name
 * @param {string} tier - Budget tier: 'budget', 'mid', or 'luxury'
 * @param {number} days - Trip duration in days
 * @param {string} packageId - Unique package identifier for stable jitter
 * @returns {Promise<Object>} Price information {priceUSD, pricePKR, breakdown}
 */
async function calculatePackagePrice(country, tier, days, packageId, city) {
  const { pkg, city: resolvedCity, tier: normalizedTier } = getPackageEntry(
    country,
    tier,
    city,
    packageId
  );

  const pkrPerUSD = await getPKRPerUSD();
  const pricePKR = pkg.price_pkr;
  const priceUSD = Math.round(pricePKR / pkrPerUSD);

  const breakdown = {
    flights: Math.round(pkg.breakdown.flights / pkrPerUSD),
    hotel: Math.round(pkg.breakdown.hotel / pkrPerUSD),
    food: Math.round(pkg.breakdown.food / pkrPerUSD),
    transport: Math.round(pkg.breakdown.transport / pkrPerUSD),
    activities: Math.round(pkg.breakdown.attractions / pkrPerUSD),
    shopping: Math.round(pkg.breakdown.shopping / pkrPerUSD),
    misc: Math.round(pkg.breakdown.misc / pkrPerUSD),
  };

  return {
    priceUSD,
    pricePKR,
    totalEstimateUSD: priceUSD,
    breakdownUSD: breakdown,
    breakdown,
    pricingDetails: {
      country,
      city: resolvedCity,
      tier: normalizedTier,
      packageDays: pkg.days,
      requestedDays: days || pkg.days,
      pkrPerUSD: pkrPerUSD.toFixed(2),
    },
  };
}

/**
 * Validate that a price is realistic (minimum derived from package table)
 */
function isPriceRealistic(priceUSD) {
  const minUSD = Math.round(MIN_PKR_THRESHOLD / FALLBACK_PKR_PER_USD);
  return priceUSD >= minUSD;
}

module.exports = {
  calculatePackagePrice,
  isPriceRealistic,
  getPKRPerUSD,
  getPricingTable,
  listPackagesUnderBudget,
  PRICING_DATABASE,
  PACKAGES_FILE,
  FALLBACK_PKR_PER_USD,
  MIN_PKR_THRESHOLD,
};
