// Quick test for TXT-based budget filtering
const { listPackagesUnderBudget, getPKRPerUSD } = require("../../services/pricing.js");

(async () => {
  try {
    const pkrPerUSD = await getPKRPerUSD();
    const budgetPKR = 200000; // Rs 2 lac
    const country = "Azerbaijan";

    const rows = listPackagesUnderBudget(country, budgetPKR);
    console.log(`PKR per USD: ${pkrPerUSD}`);
    console.log(`Budget: Rs${budgetPKR.toLocaleString()} | Country: ${country}`);
    console.log(`Matches: ${rows.length}`);
    rows.forEach((r) => {
      const usd = Math.round(r.price_pkr / pkrPerUSD);
      console.log(`${r.country}, ${r.city}, ${r.tier}, ${r.days}D -> Rs${r.price_pkr.toLocaleString()} (~$${usd})`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
