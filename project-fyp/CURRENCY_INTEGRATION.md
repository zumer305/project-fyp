# Currency Conversion Integration

## Overview

This document describes the currency conversion feature integrated throughout the application using the exchangerate.host API.

## API Details

- **Provider**: exchangerate.host
- **API Key**: `f89564ac56157b052d3e78a6976e155e`
- **Base URL**: `https://api.exchangerate.host`
- **Documentation**: https://exchangerate.host/

## Features

### 1. Backend API Endpoints

Located in `/controllers/api/currencyController.js` and `/routes/api/currency.js`

#### Available Endpoints:

- `GET /api/currency/symbols` - Get all supported currencies
- `GET /api/currency/latest` - Get latest exchange rates
  - Query params: `base` (default: USD), `symbols` (optional)
- `GET /api/currency/convert` - Convert currency
  - Query params: `from`, `to`, `amount`
- `GET /api/currency/historical` - Get historical rates
  - Query params: `date` (YYYY-MM-DD), `base`, `symbols`

### 2. Frontend Utility

Located in `/public/js/currencyConverter.js`

#### Key Features:

- **Caching**: Exchange rates cached for 1 hour
- **User Preferences**: Selected currency saved in localStorage
- **Auto-conversion**: Automatically converts prices on page
- **Widget**: Currency selector dropdown

#### Popular Currencies Supported:

- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- PKR (Pakistani Rupee)
- INR (Indian Rupee)
- UZS (Uzbek Som)
- KZT (Kazakhstani Tenge)
- TJS (Tajikistani Somoni)
- KGS (Kyrgyzstani Som)
- AED (UAE Dirham)
- SAR (Saudi Riyal)

### 3. Integration Points

#### Pages with Currency Conversion:

1. **Homepage (h.ejs)**
   - Package recommendations with dynamic pricing
2. **Package Detail Page (packageDetail.ejs)**
   - Package prices converted to selected currency
3. **Taxi Fares Page (fares.ejs)**
   - All taxi fares converted in real-time
4. **Events Page (events.ejs)**
   - Event prices (PKR format) converted to selected currency

### 4. Usage Examples

#### Backend Usage:

```javascript
// Get latest rates
const response = await fetch(
  "/api/currency/latest?base=USD&symbols=PKR,EUR,GBP"
);
const data = await response.json();

// Convert currency
const response = await fetch(
  "/api/currency/convert?from=USD&to=PKR&amount=100"
);
const data = await response.json();
// Returns: { success: true, result: 27800, rate: 278, ... }
```

#### Frontend Usage:

```javascript
// Initialize currency converter
CurrencyConverter.init({
  containerSelector: ".currency-converter-container",
  showWidget: true,
  autoConvert: false,
});

// Convert amount
const result = await CurrencyConverter.convert(100, "USD", "PKR");
console.log(result.result); // 27800

// Format currency with symbol
const formatted = CurrencyConverter.formatCurrency(27800, "PKR");
console.log(formatted); // "₨ 27,800.00"

// Get user's preferred currency
const userCurrency = CurrencyConverter.getUserCurrency(); // "USD"

// Set user's preferred currency
CurrencyConverter.setUserCurrency("EUR");
```

#### HTML Usage:

```html
<!-- Add currency converter widget -->
<div class="currency-converter-container"></div>

<!-- Mark prices for auto-conversion -->
<span data-price="100" data-currency="USD">$100</span>

<!-- Listen for currency changes -->
<script>
  document.addEventListener("currencyChanged", async (e) => {
    const newCurrency = e.detail.currency;
    // Update prices
  });
</script>
```

### 5. Styling

Custom CSS located in `/public/css/currency.css`

Features:

- Gradient purple widget design
- Responsive dropdown selector
- Price hover effects
- Loading states
- Mobile-friendly layout

### 6. File Structure

```
project-fyp/
├── controllers/
│   └── api/
│       └── currencyController.js    # Backend API logic
├── routes/
│   └── api/
│       └── currency.js              # API routes
├── public/
│   ├── js/
│   │   └── currencyConverter.js     # Frontend utility
│   └── css/
│       └── currency.css             # Widget styles
└── views/
    ├── layouts/
    │   └── boiler.ejs              # Includes currency JS/CSS
    └── listings/
        ├── h.ejs                    # Homepage with currency
        ├── packageDetail.ejs        # Package detail with currency
        ├── fares.ejs                # Taxi fares with currency
        └── events.ejs               # Events with currency
```

### 7. Configuration

#### Environment Variables (Optional)

While the API key is hardcoded for this implementation, you can optionally move it to `.env`:

```env
CURRENCY_API_KEY=f89564ac56157b052d3e78a6976e155e
```

Then update `currencyController.js`:

```javascript
const API_KEY = process.env.CURRENCY_API_KEY;
```

### 8. Testing

#### Test Backend API:

```bash
# Get latest rates
curl http://localhost:8080/api/currency/latest?base=USD

# Convert currency
curl "http://localhost:8080/api/currency/convert?from=USD&to=PKR&amount=100"

# Get supported currencies
curl http://localhost:8080/api/currency/symbols
```

#### Test Frontend:

1. Open any page with currency widget
2. Select different currency from dropdown
3. Observe prices update automatically
4. Refresh page - selected currency should persist

### 9. Error Handling

The implementation includes:

- Try-catch blocks for all API calls
- Fallback to original prices if conversion fails
- Cache validation to reduce API calls
- User-friendly error messages
- Network timeout handling (5 seconds)

### 10. Performance Optimizations

- **Caching**: Rates cached for 1 hour
- **Lazy Loading**: Conversion only when currency changes
- **Debouncing**: Prevents multiple rapid API calls
- **LocalStorage**: Persists user preferences
- **Timeout**: 5-second timeout prevents hanging requests

## Future Enhancements

1. Add more currencies from Middle East and Asia
2. Implement currency conversion history
3. Add currency comparison charts
4. Support for cryptocurrency conversion
5. Offline mode with last known rates
6. Real-time rate updates via WebSocket
7. Currency trends and analytics

## Support

For issues or questions about currency conversion:

- Check API documentation: https://exchangerate.host/documentation
- Review browser console for errors
- Verify API key is valid
- Check network connectivity

## Notes

- Free tier API has rate limits (check provider documentation)
- Rates update approximately every hour
- Historical data available for past dates
- All prices stored in database should remain in USD
- Conversion happens client-side for display only
