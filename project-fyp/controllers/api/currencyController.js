const axios = require("axios");

const API_KEY = "f89564ac56157b052d3e78a6976e155e";
const BASE_URL = "https://api.exchangerate.host";

// Cache for exchange rates (in-memory cache)
const rateCache = new Map();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// Fallback rates (approximate, updated periodically)
const FALLBACK_RATES = {
  USD_PKR: 278.5,
  USD_EUR: 0.92,
  USD_GBP: 0.79,
  USD_INR: 83.12,
  USD_AED: 3.67,
  USD_SAR: 3.75,
  USD_KZT: 453.2,
  USD_UZS: 12456.0,
  USD_TJS: 10.95,
  USD_KGS: 89.3,
  USD_CNY: 7.24,
  USD_JPY: 149.85,
  USD_RUB: 92.5,
  USD_TRY: 28.95,
  USD_AUD: 1.52,
  USD_CAD: 1.36,
  USD_CHF: 0.88,
  USD_SEK: 10.35,
  USD_NOK: 10.82,
  USD_DKK: 6.87,
};

// Get cached rate or fallback
function getCachedOrFallbackRate(from, to) {
  const cacheKey = `${from}_${to}`;
  const cached = rateCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return { rate: cached.rate, source: "cache" };
  }

  // Try direct fallback
  if (FALLBACK_RATES[cacheKey]) {
    return { rate: FALLBACK_RATES[cacheKey], source: "fallback" };
  }

  // Try reverse calculation
  const reverseCacheKey = `${to}_${from}`;
  if (FALLBACK_RATES[reverseCacheKey]) {
    return {
      rate: 1 / FALLBACK_RATES[reverseCacheKey],
      source: "fallback_reverse",
    };
  }

  // Try through USD
  if (from !== "USD" && to !== "USD") {
    const fromToUsd =
      FALLBACK_RATES[`${from}_USD`] || 1 / (FALLBACK_RATES[`USD_${from}`] || 1);
    const usdToTo =
      FALLBACK_RATES[`USD_${to}`] || 1 / (FALLBACK_RATES[`${to}_USD`] || 1);
    return { rate: fromToUsd * usdToTo, source: "fallback_calculated" };
  }

  return { rate: 1, source: "default" };
}

/**
 * Get supported currencies
 */
const getSupportedCurrencies = async (req, res) => {
  try {
    // Return our pre-defined list of popular currencies for Central Asia
    const currencies = {
      USD: { description: "United States Dollar", symbol: "$" },
      EUR: { description: "Euro", symbol: "€" },
      GBP: { description: "British Pound Sterling", symbol: "£" },
      PKR: { description: "Pakistani Rupee", symbol: "₨" },
      INR: { description: "Indian Rupee", symbol: "₹" },
      UZS: { description: "Uzbekistan Som", symbol: "so'm" },
      KZT: { description: "Kazakhstani Tenge", symbol: "₸" },
      TJS: { description: "Tajikistani Somoni", symbol: "ЅМ" },
      KGS: { description: "Kyrgyzstani Som", symbol: "с" },
      AED: { description: "United Arab Emirates Dirham", symbol: "د.إ" },
      SAR: { description: "Saudi Riyal", symbol: "﷼" },
    };

    res.json({
      success: true,
      currencies: currencies,
    });
  } catch (error) {
    console.error("Error fetching currencies:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching supported currencies",
      error: error.message,
    });
  }
};

/**
 * Get latest exchange rates
 */
const getLatestRates = async (req, res) => {
  try {
    const { base = "USD", symbols } = req.query;

    // Use convert endpoint to get rates for multiple currencies
    const targetCurrencies = symbols
      ? symbols.split(",")
      : ["PKR", "EUR", "GBP", "INR", "UZS", "KZT", "TJS", "KGS", "AED", "SAR"];

    const rates = {};

    // Get rates for each currency
    for (const targetCurrency of targetCurrencies) {
      try {
        const response = await axios.get(`${BASE_URL}/convert`, {
          params: {
            access_key: API_KEY,
            from: base.toUpperCase(),
            to: targetCurrency.toUpperCase(),
            amount: 1,
          },
          timeout: 5000,
        });

        if (response.data && response.data.result) {
          rates[targetCurrency.toUpperCase()] = response.data.result;
        }
      } catch (err) {
        console.error(
          `Error fetching rate for ${targetCurrency}:`,
          err.message
        );
      }
    }

    res.json({
      success: true,
      base: base.toUpperCase(),
      date: new Date().toISOString().split("T")[0],
      rates: rates,
    });
  } catch (error) {
    console.error("Error fetching exchange rates:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching exchange rates",
      error: error.message,
    });
  }
};

/**
 * Convert currency with cache and fallback
 */
const convertCurrency = async (req, res) => {
  try {
    const { from = "USD", to = "PKR", amount = 1 } = req.query;
    const fromCurrency = from.toUpperCase();
    const toCurrency = to.toUpperCase();
    const amountNum = parseFloat(amount);

    // Same currency - no conversion needed
    if (fromCurrency === toCurrency) {
      return res.json({
        success: true,
        query: { from: fromCurrency, to: toCurrency, amount: amountNum },
        info: { rate: 1, source: "same_currency" },
        result: amountNum,
        date: new Date().toISOString().split("T")[0],
      });
    }

    const cacheKey = `${fromCurrency}_${toCurrency}`;

    // Check cache first
    const cached = rateCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return res.json({
        success: true,
        query: { from: fromCurrency, to: toCurrency, amount: amountNum },
        info: { rate: cached.rate, source: "cache" },
        result: amountNum * cached.rate,
        date: new Date().toISOString().split("T")[0],
      });
    }

    // Try API call
    try {
      const response = await axios.get(`${BASE_URL}/convert`, {
        params: {
          access_key: API_KEY,
          from: fromCurrency,
          to: toCurrency,
          amount: 1, // Get rate for 1 unit
        },
        timeout: 3000, // Short timeout
      });

      if (response.data && response.data.result) {
        const rate = response.data.result;

        // Cache the rate
        rateCache.set(cacheKey, {
          rate: rate,
          timestamp: Date.now(),
        });

        return res.json({
          success: true,
          query: { from: fromCurrency, to: toCurrency, amount: amountNum },
          info: { rate: rate, source: "api" },
          result: amountNum * rate,
          date: new Date().toISOString().split("T")[0],
        });
      }
    } catch (apiError) {
      console.warn(
        `API call failed for ${cacheKey}, using fallback:`,
        apiError.message
      );
    }

    // Use fallback rates
    const fallback = getCachedOrFallbackRate(fromCurrency, toCurrency);

    return res.json({
      success: true,
      query: { from: fromCurrency, to: toCurrency, amount: amountNum },
      info: { rate: fallback.rate, source: fallback.source },
      result: amountNum * fallback.rate,
      date: new Date().toISOString().split("T")[0],
    });
  } catch (error) {
    console.error("Error converting currency:", error.message);

    // Even on error, try to return fallback
    const { from = "USD", to = "PKR", amount = 1 } = req.query;
    const fallback = getCachedOrFallbackRate(
      from.toUpperCase(),
      to.toUpperCase()
    );

    return res.json({
      success: true,
      query: {
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        amount: parseFloat(amount),
      },
      info: { rate: fallback.rate, source: "fallback_error" },
      result: parseFloat(amount) * fallback.rate,
      date: new Date().toISOString().split("T")[0],
    });
  }
};

/**
 * Get historical rates for a specific date
 */
const getHistoricalRates = async (req, res) => {
  try {
    const { date, base = "USD", symbols } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date parameter is required (format: YYYY-MM-DD)",
      });
    }

    // Note: Historical data might not be available in free tier
    // Return current rates as fallback
    const targetCurrencies = symbols
      ? symbols.split(",")
      : ["PKR", "EUR", "GBP", "INR", "UZS", "KZT", "TJS", "KGS", "AED", "SAR"];

    const rates = {};

    for (const targetCurrency of targetCurrencies) {
      try {
        const response = await axios.get(`${BASE_URL}/convert`, {
          params: {
            access_key: API_KEY,
            from: base.toUpperCase(),
            to: targetCurrency.toUpperCase(),
            amount: 1,
          },
          timeout: 5000,
        });

        if (response.data && response.data.result) {
          rates[targetCurrency.toUpperCase()] = response.data.result;
        }
      } catch (err) {
        console.error(
          `Error fetching historical rate for ${targetCurrency}:`,
          err.message
        );
      }
    }

    res.json({
      success: true,
      historical: true,
      base: base.toUpperCase(),
      date: date,
      rates: rates,
      note: "Historical rates may not be available in free tier, showing current rates",
    });
  } catch (error) {
    console.error("Error fetching historical rates:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching historical rates",
      error: error.message,
    });
  }
};

/**
 * Utility function to convert amount (for internal use)
 */
const convertAmount = async (amount, fromCurrency, toCurrency) => {
  try {
    const response = await axios.get(`${BASE_URL}/convert`, {
      params: {
        access_key: API_KEY,
        from: fromCurrency.toUpperCase(),
        to: toCurrency.toUpperCase(),
        amount: parseFloat(amount),
      },
      timeout: 5000,
    });

    if (response.data && response.data.result) {
      return {
        success: true,
        result: response.data.result,
        rate: response.data.result / parseFloat(amount),
      };
    }
    return { success: false, result: amount };
  } catch (error) {
    console.error("Error in convertAmount utility:", error.message);
    return { success: false, result: amount };
  }
};

module.exports = {
  getSupportedCurrencies,
  getLatestRates,
  convertCurrency,
  getHistoricalRates,
  convertAmount,
};
