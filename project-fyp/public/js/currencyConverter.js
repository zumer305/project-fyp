/**
 * Currency Conversion Utility
 * Integrates with exchangerate.host API for real-time currency conversion
 */

const CurrencyConverter = {
  // Cache for exchange rates (valid for 1 hour)
  cache: {
    rates: null,
    timestamp: null,
    baseCurrency: "USD",
  },

  // Popular currencies for Central Asia travel and worldwide
  popularCurrencies: [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
    { code: "AFN", name: "Afghan Afghani", symbol: "؋" },
    { code: "ALL", name: "Albanian Lek", symbol: "L" },
    { code: "AMD", name: "Armenian Dram", symbol: "֏" },
    { code: "ARS", name: "Argentine Peso", symbol: "$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "AZN", name: "Azerbaijani Manat", symbol: "₼" },
    { code: "BAM", name: "Bosnia Convertible Mark", symbol: "KM" },
    { code: "BDT", name: "Bangladeshi Taka", symbol: "৳" },
    { code: "BGN", name: "Bulgarian Lev", symbol: "лв" },
    { code: "BHD", name: "Bahraini Dinar", symbol: ".د.ب" },
    { code: "BRL", name: "Brazilian Real", symbol: "R$" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "CZK", name: "Czech Koruna", symbol: "Kč" },
    { code: "DKK", name: "Danish Krone", symbol: "kr" },
    { code: "EGP", name: "Egyptian Pound", symbol: "£" },
    { code: "GEL", name: "Georgian Lari", symbol: "₾" },
    { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
    { code: "HUF", name: "Hungarian Forint", symbol: "Ft" },
    { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
    { code: "ILS", name: "Israeli Shekel", symbol: "₪" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "IQD", name: "Iraqi Dinar", symbol: "ع.د" },
    { code: "IRR", name: "Iranian Rial", symbol: "﷼" },
    { code: "JOD", name: "Jordanian Dinar", symbol: "د.ا" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "KGS", name: "Kyrgyzstani Som", symbol: "с" },
    { code: "KRW", name: "South Korean Won", symbol: "₩" },
    { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك" },
    { code: "KZT", name: "Kazakhstani Tenge", symbol: "₸" },
    { code: "LBP", name: "Lebanese Pound", symbol: "ل.ل" },
    { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs" },
    { code: "MAD", name: "Moroccan Dirham", symbol: "د.م." },
    { code: "MXN", name: "Mexican Peso", symbol: "Mex$" },
    { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
    { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
    { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
    { code: "NPR", name: "Nepalese Rupee", symbol: "Rs" },
    { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
    { code: "OMR", name: "Omani Rial", symbol: "ر.ع." },
    { code: "PHP", name: "Philippine Peso", symbol: "₱" },
    { code: "PKR", name: "Pakistani Rupee", symbol: "₨" },
    { code: "PLN", name: "Polish Zloty", symbol: "zł" },
    { code: "QAR", name: "Qatari Riyal", symbol: "ر.ق" },
    { code: "RON", name: "Romanian Leu", symbol: "lei" },
    { code: "RUB", name: "Russian Ruble", symbol: "₽" },
    { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
    { code: "SEK", name: "Swedish Krona", symbol: "kr" },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
    { code: "SYP", name: "Syrian Pound", symbol: "£" },
    { code: "THB", name: "Thai Baht", symbol: "฿" },
    { code: "TJS", name: "Tajikistani Somoni", symbol: "ЅМ" },
    { code: "TMT", name: "Turkmen Manat", symbol: "m" },
    { code: "TRY", name: "Turkish Lira", symbol: "₺" },
    { code: "TWD", name: "Taiwan Dollar", symbol: "NT$" },
    { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴" },
    { code: "UZS", name: "Uzbek Som", symbol: "so'm" },
    { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
    { code: "YER", name: "Yemeni Rial", symbol: "﷼" },
    { code: "ZAR", name: "South African Rand", symbol: "R" },
  ],

  // Get user's preferred currency from localStorage or default to USD
  getUserCurrency() {
    return localStorage.getItem("preferredCurrency") || "USD";
  },

  // Set user's preferred currency
  setUserCurrency(currency) {
    localStorage.setItem("preferredCurrency", currency.toUpperCase());
  },

  // Check if cache is valid (less than 1 hour old)
  isCacheValid() {
    if (!this.cache.rates || !this.cache.timestamp) return false;
    const oneHour = 60 * 60 * 1000;
    return Date.now() - this.cache.timestamp < oneHour;
  },

  // Fetch latest exchange rates
  async fetchRates(baseCurrency = "USD") {
    try {
      const response = await fetch(`/api/currency/latest?base=${baseCurrency}`);
      const data = await response.json();

      if (data.success) {
        this.cache.rates = data.rates;
        this.cache.baseCurrency = baseCurrency;
        this.cache.timestamp = Date.now();
        return data.rates;
      }
      throw new Error("Failed to fetch rates");
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      return null;
    }
  },

  // Get exchange rates (from cache or API)
  async getRates(baseCurrency = "USD") {
    if (
      this.isCacheValid() &&
      this.cache.baseCurrency === baseCurrency.toUpperCase()
    ) {
      return this.cache.rates;
    }
    return await this.fetchRates(baseCurrency);
  },

  // Convert amount from one currency to another
  async convert(amount, fromCurrency = "USD", toCurrency = "PKR") {
    try {
      const response = await fetch(
        `/api/currency/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`
      );
      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          from: data.query.from,
          to: data.query.to,
          amount: data.query.amount,
          result: data.result,
          rate: data.info.rate,
        };
      }
      throw new Error("Conversion failed");
    } catch (error) {
      console.error("Error converting currency:", error);
      return { success: false, error: error.message };
    }
  },

  // Get ONLY the exchange rate (cached for 1 hour)
  async getExchangeRate(fromCurrency = "USD", toCurrency = "USD") {
    if (fromCurrency === toCurrency) {
      return { success: true, rate: 1 };
    }

    const cacheKey = `rate_${fromCurrency}_${toCurrency}`;
    const cached = this.cache[cacheKey];

    // Check if we have a valid cached rate
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return { success: true, rate: cached.rate };
    }

    try {
      // Fetch rate by converting 1 unit
      const response = await fetch(
        `/api/currency/convert?from=${fromCurrency}&to=${toCurrency}&amount=1`
      );
      const data = await response.json();

      if (data.success && data.info && data.info.rate) {
        const rate = data.info.rate;

        // Cache the rate
        this.cache[cacheKey] = {
          rate: rate,
          timestamp: Date.now(),
        };

        return { success: true, rate: rate };
      }

      throw new Error("Failed to get exchange rate");
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      return { success: false, error: error.message };
    }
  },

  // Convert amount using a pre-fetched rate (NO API CALL)
  convertWithRate(amount, rate) {
    return amount * rate;
  },

  // Format currency with proper symbol
  formatCurrency(amount, currencyCode) {
    const currency = this.popularCurrencies.find(
      (c) => c.code === currencyCode.toUpperCase()
    );
    const symbol = currency ? currency.symbol : currencyCode;

    // Format number with commas
    const formattedAmount = parseFloat(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return `${symbol} ${formattedAmount}`;
  },

  // Initialize currency converter on page
  async init(options = {}) {
    const {
      containerSelector = ".currency-converter-container",
      autoConvert = true,
      showWidget = true,
    } = options;

    if (showWidget) {
      this.createWidget(containerSelector);
    }

    if (autoConvert) {
      await this.convertAllPrices();
    }

    // Set up event listeners for currency change
    document.addEventListener("currencyChanged", async (e) => {
      const newCurrency = e.detail.currency;
      this.setUserCurrency(newCurrency);
      await this.convertAllPrices();
    });
  },

  // Convert all prices on the page
  async convertAllPrices() {
    const userCurrency = this.getUserCurrency();
    if (userCurrency === "USD") {
      // Reset to original USD if switching back
      this.resetToUSD();
      return;
    }

    // Convert data-price elements
    const priceElements = document.querySelectorAll(
      "[data-price], [data-currency-amount]"
    );

    for (const element of priceElements) {
      const originalAmount = parseFloat(
        element.getAttribute("data-price") ||
          element.getAttribute("data-currency-amount")
      );
      const fromCurrency = element.getAttribute("data-currency") || "USD";

      if (!isNaN(originalAmount)) {
        const result = await this.convert(
          originalAmount,
          fromCurrency,
          userCurrency
        );

        if (result.success) {
          const formattedPrice = this.formatCurrency(
            result.result,
            userCurrency
          );
          element.innerHTML = formattedPrice;
          element.setAttribute("title", `Original: $${originalAmount} USD`);
        }
      }
    }

    // Convert all text content containing prices
    await this.convertTextPrices(userCurrency);
  },

  // Convert all text mentions of prices in the entire document
  async convertTextPrices(toCurrency) {
    const currencySymbol = this.getSymbol(toCurrency);

    // Store original text if not already stored
    if (!document.body.hasAttribute("data-original-stored")) {
      this.storeOriginalText(document.body);
      document.body.setAttribute("data-original-stored", "true");
    }

    // Find all text nodes and convert currency mentions
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          // Skip script, style, and already processed nodes
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (parent.tagName === "SCRIPT" || parent.tagName === "STYLE") {
            return NodeFilter.FILTER_REJECT;
          }
          // Only process text nodes with currency symbols or amounts
          if (node.textContent.match(/\$|USD|₨|PKR|₹|INR|€|EUR|£|GBP/i)) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        },
      }
    );

    const nodesToConvert = [];
    while (walker.nextNode()) {
      nodesToConvert.push(walker.currentNode);
    }

    for (const node of nodesToConvert) {
      const originalText =
        node.parentElement.getAttribute("data-original-text") ||
        node.textContent;
      let newText = originalText;

      // Convert patterns like "$100", "USD 100", "100 USD", etc.
      newText = await this.replaceAllCurrencyMentions(newText, toCurrency);

      if (newText !== node.textContent) {
        node.textContent = newText;
      }
    }
  },

  // Store original text content
  storeOriginalText(element) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
      acceptNode: function (node) {
        if (node.tagName === "SCRIPT" || node.tagName === "STYLE") {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const elements = [element];
    while (walker.nextNode()) {
      elements.push(walker.currentNode);
    }

    for (const el of elements) {
      if (!el.hasAttribute("data-original-text") && el.childNodes.length > 0) {
        // Store original text for text nodes
        for (const child of el.childNodes) {
          if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
            el.setAttribute("data-original-text", child.textContent);
            break;
          }
        }
      }
    }
  },

  // Replace all currency mentions in text
  async replaceAllCurrencyMentions(text, toCurrency) {
    const symbol = this.getSymbol(toCurrency);
    let result = text;

    // Pattern: $123, $1,234, $1234.56
    const dollarPattern = /\$\s*([\d,]+\.?\d*)/g;
    const matches = [...text.matchAll(dollarPattern)];

    for (const match of matches) {
      const amount = parseFloat(match[1].replace(/,/g, ""));
      if (!isNaN(amount)) {
        const converted = await this.convert(amount, "USD", toCurrency);
        if (converted.success) {
          const formatted = this.formatCurrency(converted.result, toCurrency);
          result = result.replace(match[0], formatted);
        }
      }
    }

    // Pattern: "USD" text
    result = result.replace(/\(USD\)/gi, `(${toCurrency})`);
    result = result.replace(/\bUSD\b/g, toCurrency);

    // Pattern: "Budget under $100" - convert embedded amounts
    const budgetPattern = /under\s+\$\s*([\d,]+\.?\d*)/gi;
    const budgetMatches = [...text.matchAll(budgetPattern)];

    for (const match of budgetMatches) {
      const amount = parseFloat(match[1].replace(/,/g, ""));
      if (!isNaN(amount)) {
        const converted = await this.convert(amount, "USD", toCurrency);
        if (converted.success) {
          const formatted = this.formatCurrency(converted.result, toCurrency);
          result = result.replace(match[0], `under ${formatted}`);
        }
      }
    }

    return result;
  },

  // Reset all text to USD
  resetToUSD() {
    const elements = document.querySelectorAll("[data-original-text]");
    elements.forEach((el) => {
      const originalText = el.getAttribute("data-original-text");
      if (originalText) {
        // Find text node and restore
        for (const child of el.childNodes) {
          if (child.nodeType === Node.TEXT_NODE) {
            child.textContent = originalText;
            break;
          }
        }
      }
    });

    // Reset data-price elements
    const priceElements = document.querySelectorAll("[data-price]");
    priceElements.forEach((el) => {
      const originalPrice = parseFloat(el.getAttribute("data-price"));
      if (!isNaN(originalPrice)) {
        el.innerHTML = this.formatCurrency(originalPrice, "USD");
        el.removeAttribute("title");
      }
    });
  },

  // Create currency converter widget
  createWidget(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const widget = document.createElement("div");
    widget.className = "currency-widget";
    widget.innerHTML = `
      <div class="currency-selector">
        <label for="currency-select">
          <i class="fas fa-coins"></i> Currency:
        </label>
        <select id="currency-select" class="currency-select">
          ${this.popularCurrencies
            .map(
              (currency) =>
                `<option value="${currency.code}" ${
                  currency.code === this.getUserCurrency() ? "selected" : ""
                }>
                ${currency.symbol} ${currency.code} - ${currency.name}
              </option>`
            )
            .join("")}
        </select>
      </div>
    `;

    container.appendChild(widget);

    // Add event listener
    const select = widget.querySelector("#currency-select");
    select.addEventListener("change", (e) => {
      const event = new CustomEvent("currencyChanged", {
        detail: { currency: e.target.value },
      });
      document.dispatchEvent(event);
    });
  },

  // Quick conversion for inline use
  async quickConvert(amount, toCurrency = null) {
    const targetCurrency = toCurrency || this.getUserCurrency();
    if (targetCurrency === "USD") return amount;

    const result = await this.convert(amount, "USD", targetCurrency);
    return result.success ? result.result : amount;
  },

  // Get currency symbol
  getSymbol(currencyCode) {
    const currency = this.popularCurrencies.find(
      (c) => c.code === currencyCode.toUpperCase()
    );
    return currency ? currency.symbol : currencyCode;
  },
};

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = CurrencyConverter;
}
