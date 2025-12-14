# Quick Test Guide - Realistic Pricing

## Run Tests

```bash
cd project-fyp
node test-realistic-pricing.js
```

Expected output:
```
✓ PKR exchange rate: 1 USD = 278 PKR
✓ Minimum package price: $1,798.56 USD
✓ Budget tier pricing: All realistic
✓ Package generation: Max 4 packages
✓ All packages meet minimum: 100% success rate
```

## Test in Browser

### 1. Start Server
```bash
cd project-fyp
node app.js
```

### 2. Test Scenario 1: High PKR Budget
**URL**: http://localhost:8080/packages?country=Kazakhstan&budget=2800000&currency=PKR

**Expected Result**:
- Shows "Your Budget: ₨2,800,000"
- Budget in USD: $10,071.94
- 4 packages displayed
- All packages between $2,000-$7,000 USD
- Prices display in PKR (₨700,000 - ₨2,000,000)

### 3. Test Scenario 2: Low PKR Budget
**URL**: http://localhost:8080/packages?country=Kyrgyzstan&budget=800000&currency=PKR

**Expected Result**:
- Shows "Your Budget: ₨800,000"
- Budget in USD: $2,878.42
- 4 packages displayed
- Some within budget, some slightly above (fill logic)
- All packages realistic (>= PKR 500K equivalent)

### 4. Test Scenario 3: USD Budget
**URL**: http://localhost:8080/packages?country=Uzbekistan&budget=5000&currency=USD

**Expected Result**:
- Shows "Your Budget: $5,000"
- Budget in USD: $5,000
- 4 packages displayed
- All within or near $5,000
- Prices display in USD

### 5. Test Scenario 4: EUR Budget
**URL**: http://localhost:8080/packages?country=Azerbaijan&budget=10000&currency=EUR

**Expected Result**:
- Shows "Your Budget: €10,000"
- Budget in USD: ~$11,730 (varies with exchange rate)
- 4 packages displayed
- Prices display in EUR

## Verify Currency Display

### Check 1: Package Price Elements
Inspect any package price in browser console:
```javascript
document.querySelector('.price-display')
// Should have: data-price="2500" data-currency="USD"
```

### Check 2: No IQD Symbol Bug
- Search page for "IQD" symbol
- Should NOT appear anywhere (unless user selected IQD currency)

### Check 3: Budget Display
- Budget should show in user's selected currency
- Should NOT have data-price/data-currency attributes
- Should display currency symbol correctly

## Verify Pricing Logic

### Minimum Price Check
All packages should meet these minimums (approximately):
- Budget tier: ~$1,800 USD (500K PKR)
- Mid tier: ~$3,000 USD (850K PKR)
- Luxury tier: ~$5,000 USD (1.4M PKR)

### Country Variation Check
Same budget, different countries should show different prices:
- Tajikistan: Cheapest (0.85x multiplier)
- Uzbekistan: Cheaper (0.90x multiplier)
- Kyrgyzstan: Moderate (0.95x multiplier)
- Kazakhstan: Slightly higher (1.05x multiplier)
- Azerbaijan: Higher (1.10x multiplier)
- Turkmenistan: Most expensive (1.20x multiplier)

### Breakdown Check
Each package breakdown should sum to total:
- Hotel: 40% of total
- Food: 20% of total
- Transport: 15% of total
- Activities: 25% of total

## Common Issues

### Issue: Prices still showing as 50 IQD
**Fix**: 
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Check browser console for JavaScript errors

### Issue: "Cannot find module" error
**Fix**: Make sure you're in the correct directory
```bash
cd project-fyp  # NOT the parent fyp directory
node test-realistic-pricing.js
```

### Issue: generatePackages not awaited error
**Fix**: Restart the server
```bash
# Press Ctrl+C to stop
node app.js  # Restart
```

### Issue: All packages above budget
**Fix**: Check URL has correct currency parameter
```
❌ /packages?country=Kazakhstan&budget=2800000
✅ /packages?country=Kazakhstan&budget=2800000&currency=PKR
```

## API Testing with curl

### Test Package Generation
```bash
curl "http://localhost:8080/api/packages?country=Kazakhstan&budget=2800000&currency=PKR"
```

Expected JSON response:
```json
{
  "items": [
    {
      "name": "Almaty Cultural Package",
      "priceUSD": 2543,
      "totalEstimateUSD": 2543,
      "breakdownUSD": {
        "hotel": 1017,
        "food": 509,
        "transport": 381,
        "activities": 636
      },
      ...
    }
  ]
}
```

## Performance Check

### Response Time
Packages should load within:
- First request: ~1-2 seconds (fetching exchange rates)
- Subsequent requests: ~100-500ms (cached rates)

### Exchange Rate Caching
Check console logs:
```
Fetching fresh PKR exchange rate...  ← First request
PKR not supported, using fallback rate
Using fallback PKR rate: 1 USD = 278 PKR
[Subsequent requests use cache for 1 hour]
```

## Success Criteria

✓ All packages >= PKR 500,000 (~$1,800 USD)
✓ Prices scale by days, country, and tier
✓ Currency symbols display correctly
✓ No IQD symbol bug
✓ Max 4 packages returned
✓ Budget filtering works correctly
✓ Breakdown sums to total
✓ Tests pass 100%

## Next Steps After Verification

1. Test with real users
2. Monitor for edge cases
3. Adjust pricing if needed
4. Add more currencies to fallback rates
5. Consider seasonal pricing
6. Implement price history tracking
