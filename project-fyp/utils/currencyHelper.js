/**
 * Server-side currency conversion helper
 * Uses Frankfurter API for exchange rates with 1-hour caching
 */

const rateCache = {
  rates: {},
  timestamp: null,
  cacheExpiry: 60 * 60 * 1000, // 1 hour
};

/**
 * Fetch latest exchange rates from Frankfurter API
 */
async function fetchExchangeRates() {
  try {
    const response = await fetch('https://api.frankfurter.app/latest?from=USD');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates from Frankfurter:', error);
    return null;
  }
}

/**
 * Get exchange rate from cache or fetch new rates
 */
async function getExchangeRate(fromCurrency, toCurrency) {
  // If same currency, rate is 1
  if (fromCurrency === toCurrency) {
    return 1;
  }

  // Check if cache is valid
  const now = Date.now();
  const cacheValid = rateCache.timestamp && (now - rateCache.timestamp) < rateCache.cacheExpiry;

  if (!cacheValid || !rateCache.rates || Object.keys(rateCache.rates).length === 0) {
    console.log('Fetching fresh exchange rates from Frankfurter API...');
    const rates = await fetchExchangeRates();
    if (rates) {
      rateCache.rates = rates;
      rateCache.timestamp = now;
    } else {
      console.warn('Failed to fetch rates, using fallback rate of 1');
      return 1;
    }
  }

  // Handle USD as base currency
  if (fromCurrency === 'USD') {
    return rateCache.rates[toCurrency] || 1;
  }

  // Handle conversion from non-USD to USD
  if (toCurrency === 'USD') {
    return 1 / (rateCache.rates[fromCurrency] || 1);
  }

  // Handle conversion between two non-USD currencies
  const usdToFrom = rateCache.rates[fromCurrency] || 1;
  const usdToTo = rateCache.rates[toCurrency] || 1;
  return usdToTo / usdToFrom;
}

/**
 * Convert amount from one currency to another
 */
async function convertCurrency(amount, fromCurrency, toCurrency) {
  try {
    const rate = await getExchangeRate(fromCurrency, toCurrency);
    return amount * rate;
  } catch (error) {
    console.error('Error converting currency:', error);
    return amount; // Return original amount as fallback
  }
}

/**
 * Fallback exchange rates for currencies not supported by Frankfurter
 * Updated periodically - these are approximate rates
 */
const FALLBACK_RATES = {
  PKR: 278.0,  // Pakistani Rupee
  IRR: 42000.0, // Iranian Rial
  VND: 24000.0, // Vietnamese Dong
  // Add more as needed
};

/**
 * Convert budget to USD for package filtering
 */
async function convertBudgetToUSD(budget, currency) {
  if (!budget || isNaN(budget)) {
    console.warn('Invalid budget provided:', budget);
    return 0;
  }

  if (!currency || currency === 'USD') {
    return parseFloat(budget);
  }

  try {
    const budgetUSD = await convertCurrency(parseFloat(budget), currency, 'USD');
    
    // Check if conversion failed (returned same amount = 1:1 rate which is wrong)
    if (budgetUSD === parseFloat(budget) && currency !== 'USD') {
      // Try fallback rate
      if (FALLBACK_RATES[currency]) {
        const fallbackUSD = parseFloat(budget) / FALLBACK_RATES[currency];
        console.log(`Using fallback rate: ${budget} ${currency} = ${fallbackUSD.toFixed(2)} USD`);
        return fallbackUSD;
      }
    }
    
    console.log(`Converted ${budget} ${currency} to ${budgetUSD.toFixed(2)} USD`);
    return budgetUSD;
  } catch (error) {
    console.error('Error converting budget to USD:', error);
    
    // Try fallback rate
    if (FALLBACK_RATES[currency]) {
      const fallbackUSD = parseFloat(budget) / FALLBACK_RATES[currency];
      console.log(`Using fallback rate after error: ${budget} ${currency} = ${fallbackUSD.toFixed(2)} USD`);
      return fallbackUSD;
    }
    
    console.warn('Falling back to treating budget as USD');
    return parseFloat(budget);
  }
}

module.exports = {
  getExchangeRate,
  convertCurrency,
  convertBudgetToUSD,
};
