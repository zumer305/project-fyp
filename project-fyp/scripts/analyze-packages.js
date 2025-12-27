#!/usr/bin/env node
/**
 * Analyze Central Asia travel packages from TXT (CSV-like) file.
 * Features:
 * - Load and analyze all rows
 * - Filter by Country, City, Package Type (Budget/Mid-Range/Luxury)
 * - Summary: avg/min/max total per country
 * - Highlight cheapest and most expensive package per country
 * - Comparison table: Budget vs Mid-Range vs Luxury per country
 * - Format currency in PKR
 *
 * Usage examples:
 *   node project-fyp/scripts/analyze-packages.js
 *   node project-fyp/scripts/analyze-packages.js --country=Kazakhstan
 *   node project-fyp/scripts/analyze-packages.js --country=Uzbekistan --city=Tashkent --type=Mid-Range
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'dataset', 'central_asia_travel_packages.txt');

function parseArgs(argv) {
  const out = {};
  argv.slice(2).forEach(arg => {
    const m = arg.match(/^--([^=]+)=(.*)$/);
    if (m) {
      out[m[1]] = m[2];
    }
  });
  return out;
}

function formatPKR(n) {
  const num = Number(n) || 0;
  return `Rs${num.toLocaleString('en-PK')}`;
}

function normalizeTier(t) {
  if (!t) return '';
  const s = String(t).toLowerCase();
  if (s.startsWith('budget')) return 'Budget';
  if (s.startsWith('mid')) return 'Mid-Range';
  if (s.startsWith('lux')) return 'Luxury';
  return t;
}

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length <= 1) return [];
  const header = lines[0].split(',').map(h => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim());
    const o = {};
    header.forEach((h, idx) => {
      o[h] = cols[idx] || '';
    });
    rows.push(o);
  }
  return rows;
}

function coerceNumber(value) {
  const n = parseInt(String(value).replace(/[^0-9-]/g, ''), 10);
  return Number.isFinite(n) ? n : 0;
}

function loadData(filePath = DATA_FILE) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Data file not found: ${filePath}`);
  }
  const txt = fs.readFileSync(filePath, 'utf8');
  const rows = parseCSV(txt).map(r => ({
    country: r['Country'],
    city: r['City'],
    type: normalizeTier(r['Package Type']),
    daysNights: r['Days/Nights'],
    flights: coerceNumber(r['Flights (PKR)']),
    hotel: coerceNumber(r['Hotel (PKR)']),
    food: coerceNumber(r['Food (PKR)']),
    transport: coerceNumber(r['Transport (PKR)']),
    attractions: coerceNumber(r['Attractions (PKR)']),
    shopping: coerceNumber(r['Shopping (PKR)']),
    misc: coerceNumber(r['Misc & Insurance (PKR)']),
    total: coerceNumber(r['Total (PKR)']),
  }));
  return rows;
}

function filterRows(rows, { country, city, type }) {
  return rows.filter(r => {
    if (country && r.country !== country) return false;
    if (city && r.city !== city) return false;
    if (type && normalizeTier(r.type) !== normalizeTier(type)) return false;
    return true;
  });
}

function summarizeByCountry(rows) {
  const byCountry = new Map();
  rows.forEach(r => {
    if (!byCountry.has(r.country)) byCountry.set(r.country, []);
    byCountry.get(r.country).push(r);
  });

  const summary = [];
  const extremes = []; // cheapest/most expensive per country
  const typeCompare = []; // budget/mid/lux avg per country

  for (const [country, list] of byCountry.entries()) {
    const totals = list.map(r => r.total);
    const avg = Math.round(totals.reduce((a,b)=>a+b,0) / totals.length);
    const min = Math.min(...totals);
    const max = Math.max(...totals);

    const cheapest = list.reduce((acc, r) => (r.total < acc.total ? r : acc), list[0]);
    const mostExp = list.reduce((acc, r) => (r.total > acc.total ? r : acc), list[0]);

    summary.push({
      Country: country,
      'Average Total (PKR)': formatPKR(avg),
      'Min Total (PKR)': formatPKR(min),
      'Max Total (PKR)': formatPKR(max),
      'Packages': list.length,
    });

    extremes.push({
      Country: country,
      Cheapest: `${cheapest.city} - ${cheapest.type} (${formatPKR(cheapest.total)})`,
      MostExpensive: `${mostExp.city} - ${mostExp.type} (${formatPKR(mostExp.total)})`,
    });

    const byType = list.reduce((m, r) => {
      const k = r.type;
      if (!m[k]) m[k] = [];
      m[k].push(r.total);
      return m;
    }, {});

    const avgBudget = byType['Budget'] ? Math.round(byType['Budget'].reduce((a,b)=>a+b,0) / byType['Budget'].length) : 0;
    const avgMid = byType['Mid-Range'] ? Math.round(byType['Mid-Range'].reduce((a,b)=>a+b,0) / byType['Mid-Range'].length) : 0;
    const avgLuxury = byType['Luxury'] ? Math.round(byType['Luxury'].reduce((a,b)=>a+b,0) / byType['Luxury'].length) : 0;

    typeCompare.push({
      Country: country,
      'Budget Avg (PKR)': formatPKR(avgBudget),
      'Mid-Range Avg (PKR)': formatPKR(avgMid),
      'Luxury Avg (PKR)': formatPKR(avgLuxury),
    });
  }

  // Sort for readability
  summary.sort((a,b)=> a.Country.localeCompare(b.Country));
  extremes.sort((a,b)=> a.Country.localeCompare(b.Country));
  typeCompare.sort((a,b)=> a.Country.localeCompare(b.Country));

  return { summary, extremes, typeCompare };
}

function printTable(title, rows) {
  console.log('\n' + title);
  console.log('-'.repeat(title.length));
  if (!rows || rows.length === 0) {
    console.log('No data');
    return;
  }
  console.table(rows);
}

function main() {
  try {
    const args = parseArgs(process.argv);
    const all = loadData(DATA_FILE);

    // Filtered view
    const filtered = filterRows(all, {
      country: args.country,
      city: args.city,
      type: args.type,
    });

    const filteredPrintable = filtered.map(r => ({
      Country: r.country,
      City: r.city,
      Type: r.type,
      'Days/Nights': r.daysNights,
      'Flights (PKR)': formatPKR(r.flights),
      'Hotel (PKR)': formatPKR(r.hotel),
      'Food (PKR)': formatPKR(r.food),
      'Transport (PKR)': formatPKR(r.transport),
      'Attractions (PKR)': formatPKR(r.attractions),
      'Shopping (PKR)': formatPKR(r.shopping),
      'Misc & Insurance (PKR)': formatPKR(r.misc),
      'Total (PKR)': formatPKR(r.total),
    }));

    // Summaries
    const { summary, extremes, typeCompare } = summarizeByCountry(all);

    // Output
    console.log('='.repeat(80));
    console.log('Central Asia Travel Packages — Analysis from TXT file');
    console.log('Source:', DATA_FILE);
    console.log('Total rows:', all.length);
    console.log('Filters:', args);
    console.log('='.repeat(80));

    printTable('Filtered Rows', filteredPrintable);
    printTable('Summary by Country (Avg / Min / Max Total)', summary);
    printTable('Cheapest vs Most Expensive per Country', extremes);
    printTable('Budget vs Mid-Range vs Luxury (Average Total per Country)', typeCompare);

  } catch (err) {
    console.error('Error:', err.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = { loadData, filterRows, summarizeByCountry, formatPKR };
