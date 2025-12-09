# 🌍 Currency Converter - Quick Start Guide

## What You Got

I've integrated a **real-time currency conversion system** throughout your entire travel app using the exchangerate.host API.

## 🎯 Where to See It

### 1. **Homepage** (`http://localhost:8080/`)
- Purple currency widget at the top
- All package prices convert instantly

### 2. **Taxi Fares Page** (`/fares`)
- Base fares, per-km rates, and total fares
- All convert to your selected currency

### 3. **Events Page** (`/events`)
- Event ticket prices
- PKR prices convert to any currency

### 4. **Package Details** (`/package-detail`)
- Full package prices
- Instant conversion when you change currency

## 🚀 How to Use

### Step 1: Start Your Server
```bash
cd c:\Users\Hp\Desktop\fyp\project-fyp
npm start
```

### Step 2: Open Your Browser
Visit: `http://localhost:8080`

### Step 3: Find the Currency Widget
Look for a **purple gradient box** at the top of the page with:
```
💰 Currency: [Dropdown with currencies]
```

### Step 4: Select Your Currency
Click the dropdown and choose from:
- 💵 USD - US Dollar
- 💶 EUR - Euro  
- 💷 GBP - British Pound
- 🇵🇰 PKR - Pakistani Rupee
- 🇮🇳 INR - Indian Rupee
- 🇺🇿 UZS - Uzbek Som
- 🇰🇿 KZT - Kazakhstani Tenge
- 🇹🇯 TJS - Tajikistani Somoni
- 🇰🇬 KGS - Kyrgyzstani Som
- 🇦🇪 AED - UAE Dirham
- 🇸🇦 SAR - Saudi Riyal

### Step 5: Watch Prices Update
All prices on the page will automatically convert to your selected currency!

## 💡 Cool Features

### ✨ Automatic Conversion
- Select a currency once
- All prices update instantly
- No need to refresh the page

### 💾 Remembers Your Choice
- Your selected currency is saved
- Stays the same when you come back
- Works across all pages

### ⚡ Fast Performance
- Rates cached for 1 hour
- Reduces API calls
- Instant updates

### 🎨 Beautiful Design
- Purple gradient widget
- Smooth animations
- Mobile-friendly

## 🧪 Test It Right Now

### Quick Test:
```bash
# Test the API directly
node test-currency.js
```

### Expected Output:
```
🧪 Testing Currency Conversion API
✅ 50 USD = 42.94 EUR
✅ 1000 USD = 11993800.90 UZS
✅ 200 USD = 102228.50 KZT
🎉 Currency API Testing Complete!
```

## 📱 Example User Journey

1. **User arrives on homepage**
   - Sees packages priced in USD by default
   - Widget shows "Currency: USD"

2. **User is from Pakistan**
   - Clicks currency dropdown
   - Selects "PKR - Pakistani Rupee"

3. **Magic happens!** ✨
   - All $100 prices → ₨ 28,061
   - All $500 prices → ₨ 140,305
   - Widget remembers choice

4. **User browses taxi fares**
   - Fares also in PKR
   - No need to select again

5. **User returns next day**
   - Still shows PKR
   - Preference saved!

## 🔌 API Endpoints Available

### Convert Currency
```javascript
// Example: Convert $100 USD to PKR
fetch('/api/currency/convert?from=USD&to=PKR&amount=100')
  .then(r => r.json())
  .then(data => console.log(data.result)); // 28061.15
```

### Get Exchange Rates
```javascript
// Get current rates for multiple currencies
fetch('/api/currency/latest?base=USD&symbols=PKR,EUR,GBP')
  .then(r => r.json())
  .then(data => console.log(data.rates));
```

### Get Supported Currencies
```javascript
fetch('/api/currency/symbols')
  .then(r => r.json())
  .then(data => console.log(data.currencies));
```

## 🎨 How to Customize

### Change Default Currency
In `public/js/currencyConverter.js`, line 16:
```javascript
getUserCurrency() {
  return localStorage.getItem("preferredCurrency") || "PKR"; // Change USD to PKR
}
```

### Add More Currencies
In `public/js/currencyConverter.js`, add to `popularCurrencies` array:
```javascript
{ code: "CNY", name: "Chinese Yuan", symbol: "¥" },
```

### Change Widget Colors
In `public/css/currency.css`, line 8:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
/* Change to your preferred gradient */
```

## 📊 What Gets Converted

### ✅ Converted:
- Package prices
- Taxi fares (base fare, per-km, total)
- Event ticket prices
- All amounts with `data-price` attribute

### ❌ Not Converted:
- Database values (always stored in USD)
- API responses (returned in original currency)
- Historical data

## 🔒 Security Notes

- API key is hardcoded in `currencyController.js`
- Consider moving to `.env` for production
- Free tier has rate limits
- Caching reduces API calls

## 🐛 Troubleshooting

### Prices not updating?
1. Check browser console (F12)
2. Verify internet connection
3. Clear browser cache
4. Check localStorage is enabled

### Widget not showing?
1. Verify `currencyConverter.js` is loaded
2. Check `currency.css` is included
3. Look for `<div class="currency-converter-container"></div>` in HTML

### API errors?
1. Run `node test-currency.js`
2. Check API key is correct
3. Verify exchangerate.host is accessible
4. Check rate limits

## 📈 Rate Limits

- Free tier: Check exchangerate.host docs
- Caching: 1 hour per set of rates
- Recommendation: Don't make unnecessary calls

## 🎉 You're All Set!

Your app now has **professional currency conversion** across all pages!

Users from any country can see prices in their local currency with just one click.

---

**Need Help?**
- Check `CURRENCY_INTEGRATION.md` for technical details
- Run `node test-currency.js` to verify API
- Check browser console for errors

**Enjoy your multi-currency travel app! 🌍✈️**
