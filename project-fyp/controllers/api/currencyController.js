const axios = require("axios");

const API_KEY = "f89564ac56157b052d3e78a6976e155e";
const BASE_URL = "https://api.exchangerate.host";

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
        console.error(`Error fetching rate for ${targetCurrency}:`, err.message);
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
 * Convert currency
 */
const convertCurrency = async (req, res) => {
  try {
    const { from = "USD", to = "PKR", amount = 1 } = req.query;

    const response = await axios.get(`${BASE_URL}/convert`, {
      params: {
        access_key: API_KEY,
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        amount: parseFloat(amount),
      },
      timeout: 5000,
    });

    if (response.data && response.data.result) {
      res.json({
        success: true,
        query: {
          from: from.toUpperCase(),
          to: to.toUpperCase(),
          amount: parseFloat(amount),
        },
        info: {
          rate: response.data.result / parseFloat(amount),
        },
        result: response.data.result,
        date: new Date().toISOString().split("T")[0],
      });
    } else {
      throw new Error("Failed to convert currency");
    }
  } catch (error) {
    console.error("Error converting currency:", error.message);
    res.status(500).json({
      success: false,
      message: "Error converting currency",
      error: error.message,
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
        console.error(`Error fetching historical rate for ${targetCurrency}:`, err.message);
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
