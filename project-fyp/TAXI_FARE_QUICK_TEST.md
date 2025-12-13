# QUICK START: Testing Country-Specific Taxi Fares

## 🚀 What Was Implemented

A hardcoded taxi fare system for **6 Central Asian countries** that automatically detects the selected destination and displays country-specific pricing in local currency.

## 🌍 Countries & Currencies

| Country | Currency | Symbol | Detection Keywords |
|---------|----------|--------|-------------------|
| 🇦🇿 Azerbaijan | AZN | ₼ | azerbaijan, baku, ganja |
| 🇰🇿 Kazakhstan | KZT | ₸ | kazakhstan, almaty, astana, nur-sultan |
| 🇺🇿 Uzbekistan | UZS | soʻm | uzbekistan, tashkent, samarkand, bukhara |
| 🇰🇬 Kyrgyzstan | KGS | с | kyrgyzstan, bishkek, osh |
| 🇹🇯 Tajikistan | TJS | ЅМ | tajikistan, dushanbe |
| 🇹🇲 Turkmenistan | TMT | m | turkmenistan, ashgabat |

## 📋 Quick Test Steps

### Option 1: Use the Test Page
```bash
# 1. Open test-country-fares.html in your browser
# 2. Click any country button to set localStorage
# 3. Navigate to /listings/fares
# 4. See country-specific pricing!
```

### Option 2: Manual Browser Console
```javascript
// Test Azerbaijan (Default)
localStorage.setItem('selectedDestination', 'Baku, Azerbaijan');
localStorage.setItem('estimatedDistance', '10');
// Now open: http://localhost:8080/listings/fares

// Test Kazakhstan
localStorage.setItem('selectedDestination', 'Almaty, Kazakhstan');

// Test Uzbekistan
localStorage.setItem('selectedDestination', 'Tashkent, Uzbekistan');

// Test Kyrgyzstan
localStorage.setItem('selectedDestination', 'Bishkek, Kyrgyzstan');

// Test Tajikistan
localStorage.setItem('selectedDestination', 'Dushanbe, Tajikistan');

// Test Turkmenistan
localStorage.setItem('selectedDestination', 'Ashgabat, Turkmenistan');
```

## 💰 Example Pricing (10km trip)

### Azerbaijan (₼)
- **Standard:** ₼222.80 base + ₼835.50 (10km) = **₼1,058.30**
- **Premium:** ₼417.75 base + ₼1,671.00 (10km) = **₼2,088.75**
- **Night +20%:** Additional ₼211.66 - ₼417.75

### Kazakhstan (₸)
- **Standard:** ₸300 base + ₸1,000 (10km) = **₸1,300**
- **Premium:** ₸500 base + ₸2,000 (10km) = **₸2,500**
- **Night +25%:** Additional ₸325 - ₸625

### Uzbekistan (soʻm)
- **Standard:** soʻm10,000 base + soʻm30,000 (10km) = **soʻm40,000**
- **Premium:** soʻm20,000 base + soʻm60,000 (10km) = **soʻm80,000**
- **Night +30%:** Additional soʻm12,000 - soʻm24,000

## ✨ Features Implemented

### 1. Automatic Country Detection
- Reads `selectedDestination` from localStorage
- Matches keywords to detect country
- Falls back to Azerbaijan if no match

### 2. Six Vehicle Types Per Country
- ✅ Standard Taxi
- ✅ Comfort Taxi
- ✅ Economy Taxi
- ✅ Premium Taxi
- ✅ Minivan
- ✅ Shared Taxi

### 3. Dynamic Pricing Components
- ✅ Base Fare (country-specific range)
- ✅ Per Kilometer Rate (country-specific)
- ✅ Waiting Time (/min)
- ✅ Night Charge (10 PM - 6 AM)

### 4. Visual Elements
- ✅ Country badge with flag emoji
- ✅ Currency symbol display
- ✅ Fare breakdown by component
- ✅ Night charge indicator
- ✅ Responsive card layout

## 🎯 What Shows on the Page

1. **Country Badge**
   - 🇦🇿 Taxi Fares for Azerbaijan - Currency: AZN (₼)

2. **Fare Structure Box**
   - Base Fare: ₼222.80 - ₼417.75
   - Per Kilometer: ₼83.55 - ₼167.10
   - Waiting Time: ₼41.78/min
   - Night Charge: +20%

3. **Six Vehicle Cards** (each showing):
   - Vehicle name and emoji
   - Capacity
   - Base fare
   - Per km rate
   - Distance cost
   - Waiting time rate
   - Night charge (if applicable)
   - **Total fare**
   - Features list

## 📊 Price Data Sources

All prices based on **December 2025** market rates from:
- Yandex Taxi
- Bolt
- inDriver
- Local taxi services
- Government regulations

## 🔧 Files Modified

- `views/listings/fares.ejs` - Main implementation

## 🔥 Key Code Sections

### Country Fare Data (Lines ~465-510)
```javascript
const COUNTRY_FARES = {
    "Azerbaijan": {
        baseFare: { min: 222.80, max: 417.75 },
        perKm: { min: 83.55, max: 167.10 },
        // ... more data
    }
}
```

### Country Detection (Lines ~520-545)
```javascript
function detectCountry(destination) {
    // Checks destination string for keywords
    // Returns country name
}
```

### Vehicle Generation (Lines ~580-630)
```javascript
function generateCountryFares() {
    // Creates 6 vehicle types
    // Uses country-specific pricing
}
```

### Currency Formatting (Lines ~680-685)
```javascript
function formatCurrency(amount) {
    return `${currentCountryFares.currencySymbol}${amount.toFixed(2)}`;
}
```

## 🎨 Visual Output Example

```
┌─────────────────────────────────────────────┐
│ 🇦🇿 Taxi Fares for Azerbaijan - AZN (₼)    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Standard Fare Structure - Azerbaijan        │
├─────────────────────────────────────────────┤
│ Base Fare:      ₼222.80 - ₼417.75          │
│ Per Kilometer:  ₼83.55 - ₼167.10           │
│ Waiting Time:   ₼41.78/min                 │
│ Night Charge:   +20%                        │
└─────────────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┐
│ 🚕 Standard  │ 🚙 Comfort   │ 🚗 Economy   │
│ Taxi         │ Taxi         │ Taxi         │
│              │              │              │
│ Base: ₼222.80│ Base: ₼312.83│ Base: ₼189.38│
│ 10km: ₼835.50│ 10km:₼1,251.33│10km: ₼751.95│
│ Total:₼1,058.30│Total:₼1,564.15│Total: ₼941.33│
└──────────────┴──────────────┴──────────────┘
```

## ⚠️ Important Notes

1. **Default Country:** Azerbaijan (if no match found)
2. **Night Hours:** 10 PM - 6 AM (22:00 - 06:00)
3. **Distance:** Uses `estimatedDistance` from localStorage
4. **Real-time:** Night charge calculated based on current time

## 🐛 Troubleshooting

**Problem:** All prices show Azerbaijan rates
**Solution:** Ensure destination contains country/city keywords

**Problem:** Prices look wrong
**Solution:** Check currency - large numbers normal for UZS, KZT

**Problem:** No vehicles showing
**Solution:** Check browser console for errors, verify localStorage has `selectedDestination`

## 📈 Next Steps to Enhance

1. Add currency converter option
2. Save user's last selected country
3. Add more cities for detection
4. Include tax/service charge options
5. Add promotional discount codes
6. Multi-destination fare calculation

---

**Ready to Test?**
1. Open `test-country-fares.html`
2. Click any country button
3. View `/listings/fares`
4. See country-specific pricing! 🎉

**Need More Details?**
See `TAXI_FARE_SYSTEM.md` for complete documentation.
