#!/usr/bin/env node
/**
 * Import central_asia_travel_packages.txt into MongoDB (TravelPackage collection).
 * Usage:
 *   node scripts/import-packages.js
 */

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const TravelPackage = require("../models/travelPackage");

const DATA_FILE = path.join(__dirname, "..", "dataset", "central_asia_travel_packages.txt");
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";

function normalizeTier(t) {
  if (!t) return "";
  const s = String(t).toLowerCase();
  if (s.startsWith("budget")) return "Budget";
  if (s.startsWith("mid")) return "Mid-Range";
  if (s.startsWith("lux")) return "Luxury";
  return t;
}

function coerceNumber(value) {
  const n = parseInt(String(value).replace(/[^0-9-]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

function parseFile() {
  if (!fs.existsSync(DATA_FILE)) {
    throw new Error(`Data file not found: ${DATA_FILE}`);
  }
  const txt = fs.readFileSync(DATA_FILE, "utf8");
  const lines = txt.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length <= 1) return [];
  const header = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cols = line.split(",").map((c) => c.trim());
    const get = (name) => cols[header.indexOf(name)] || "";
    return {
      country: get("Country"),
      city: get("City"),
      packageType: normalizeTier(get("Package Type")),
      duration: get("Days/Nights"),
      flights: coerceNumber(get("Flights (PKR)")),
      hotel: coerceNumber(get("Hotel (PKR)")),
      food: coerceNumber(get("Food (PKR)")),
      transport: coerceNumber(get("Transport (PKR)")),
      attractions: coerceNumber(get("Attractions (PKR)")),
      shopping: coerceNumber(get("Shopping (PKR)")),
      misc: coerceNumber(get("Misc & Insurance (PKR)")),
      total: coerceNumber(get("Total (PKR)")),
    };
  });
}

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log(`Connected to ${MONGO_URL}`);

  const rows = parseFile();
  if (!rows.length) {
    console.warn("No rows found to import.");
    return;
  }

  console.log(`Importing ${rows.length} packages...`);
  for (const row of rows) {
    await TravelPackage.findOneAndUpdate(
      { country: row.country, city: row.city, packageType: row.packageType },
      row,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log("Import complete.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
