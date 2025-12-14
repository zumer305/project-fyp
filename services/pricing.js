/**
 * Realistic Pricing Model for Travel Packages
 * All prices calculated in PKR, then converted to USD for storage
 */

const { convertCurrency } = require('../project-fyp/utils/currencyHelper.js');

// Base prices in PKR per tier (starting price for 3 days)
const BASE_PRICES_PKR = {
  budget: 500000,   // ~$1,800 USD
  mid: 850000,      // ~$3,060 USD
  luxury: 1400000,  // ~$5,040 USD
};

// Per-day increments in PKR
const PER_DAY_PKR = {
  budget: 60000,    // ~$216 USD per day
  mid: 90000,       // ~$324 USD per day
  luxury: 140000,   // ~$504 USD per day
};

// Country multipliers (cost of living adjustments)
const COUNTRY_MULTIPLIERS = {
  'Kyrgyzstan': 0.95,
  'Uzbekistan': 0.90,
  'Tajikistan': 0.85,
  'Kazakhstan': 1.05,
  'Turkmenistan': 1.20,
  'Azerbaijan': 1.10,
};

// Minimum days for pricing (prevents unrealistic single-day prices)
const MIN_PRICING_DAYS = 3;

// Fallback PKR per USD if API fails
const FALLBACK_PKR_PER_USD = 278;

// Cache for PKR exchange rate
let pkrRateCache = {
  rate: FALLBACK_PKR_PER_USD,
  timestamp: null,
  expiry: 60 * 60 * 1000, // 1 hour
};

/**
 * Stable hash function for consistent jitter per package
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Get stable jitter multiplier (0.90 to 1.10) based on package ID
 */
function getStableJitter(packageId) {
  const hash = simpleHash(packageId);
  // Map hash to 0.90-1.10 range
  return 0.90 + (hash % 21) / 100;
}

/**
 * Get PKR per USD exchange rate (cached)
 */
async function getPKRPerUSD() {
  const now = Date.now();
  
  // Check if cache is valid
  if (pkrRateCache.timestamp && (now - pkrRateCache.timestamp) < pkrRateCache.expiry) {
    return pkrRateCache.rate;
  }
  
  // Try to fetch fresh rate
  try {
    console.log('Fetching fresh PKR exchange rate...');
    const rate = await convertCurrency(1, 'USD', 'PKR');
    
    // Check if rate is realistic (Frankfurt doesn't support PKR, so it returns 1)
    if (rate && rate > 1 && rate !== 1) {
      pkrRateCache.rate = rate;
      pkrRateCache.timestamp = now;
      console.log(`PKR rate updated: 1 USD = ${rate} PKR`);
      return rate;
    } else {
      // Rate is 1:1, which means PKR is not supported
      console.warn('PKR not supported by Frankfurter, using fallback rate');
    }
  } catch (error) {
    console.warn('Failed to fetch PKR rate:', error.message);
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
async function calculatePackagePrice(country, tier, days, packageId) {
  // Normalize inputs
  const normalizedTier = tier || 'mid';
  const daysActual = days || 5;
  
  // Use minimum days for pricing (prevents unrealistic low prices)
  const daysPriced = Math.max(daysActual, MIN_PRICING_DAYS);
  
  // Get base price and per-day rate for this tier
  const basePKR = BASE_PRICES_PKR[normalizedTier] || BASE_PRICES_PKR.mid;
  const perDayPKR = PER_DAY_PKR[normalizedTier] || PER_DAY_PKR.mid;
  
  // Get country multiplier
  const countryMultiplier = COUNTRY_MULTIPLIERS[country] || 1.0;
  
  // Get stable jitter for this package
  const jitter = getStableJitter(packageId);
  
  // Calculate price in PKR
  // Formula: (base + (days-1)*perDay) * countryMultiplier * jitter
  // We subtract 1 from days because base includes first day
  const pricePKR = Math.round(
    (basePKR + (daysPriced - 1) * perDayPKR) * countryMultiplier * jitter
  );
  
  // Get PKR per USD rate
  const pkrPerUSD = await getPKRPerUSD();
  
  // Convert to USD
  const priceUSD = Math.round(pricePKR / pkrPerUSD);
  
  // Calculate breakdown (in USD)
  const breakdown = {
    hotel: Math.round(priceUSD * 0.40),
    food: Math.round(priceUSD * 0.20),
    transport: Math.round(priceUSD * 0.15),
    activities: Math.round(priceUSD * 0.25),
  };
  
  // Ensure breakdown sums to total (adjust activities for rounding)
  const breakdownSum = breakdown.hotel + breakdown.food + breakdown.transport + breakdown.activities;
  if (breakdownSum !== priceUSD) {
    breakdown.activities += (priceUSD - breakdownSum);
  }
  
  return {
    priceUSD,
    pricePKR,
    totalEstimateUSD: priceUSD,
    breakdownUSD: breakdown,
    breakdown: breakdown, // For compatibility
    pricingDetails: {
      tier: normalizedTier,
      daysActual,
      daysPriced,
      basePKR,
      perDayPKR,
      countryMultiplier,
      jitter: jitter.toFixed(2),
      pkrPerUSD: pkrPerUSD.toFixed(2),
    }
  };
}

/**
 * Validate that a price is realistic (minimum PKR 500,000 equivalent)
 */
function isPriceRealistic(priceUSD) {
  const minPriceUSD = Math.round(500000 / FALLBACK_PKR_PER_USD); // ~$1,800
  return priceUSD >= minPriceUSD;
}

module.exports = {
  calculatePackagePrice,
  isPriceRealistic,
  getPKRPerUSD,
  BASE_PRICES_PKR,
  PER_DAY_PKR,
  COUNTRY_MULTIPLIERS,
  MIN_PRICING_DAYS,
};
