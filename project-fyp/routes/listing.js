const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js"); //import file listing
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
// const{validateListing}=require("../middleware.js");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const fs = require("fs");
const path = require("path");

const listingController = require("../controllers/listings.js");

const datasetPath = path.join(
  __dirname,
  "..",
  "dataset",
  "central_asia_travel_packages.txt"
);

// Coordinates for dataset-backed cities
const datasetCoordinates = {
  "Azerbaijan|Baku": { lat: 40.4093, lon: 49.8671, isCapital: true },
  "Azerbaijan|Sheki": { lat: 41.1975, lon: 47.1706, isCapital: false },
  "Azerbaijan|Gabala": { lat: 40.981, lon: 47.8457, isCapital: false },
  "Kazakhstan|Astana": { lat: 51.1694, lon: 71.4491, isCapital: true },
  "Kazakhstan|Almaty": { lat: 43.222, lon: 76.8512, isCapital: false },
  "Kazakhstan|Shymkent": { lat: 42.3, lon: 69.6, isCapital: false },
  "Kyrgyzstan|Bishkek": { lat: 42.8746, lon: 74.5698, isCapital: true },
  "Kyrgyzstan|Osh": { lat: 40.5283, lon: 72.7985, isCapital: false },
  "Kyrgyzstan|Karakol": { lat: 42.4907, lon: 78.3819, isCapital: false },
  "Tajikistan|Dushanbe": { lat: 38.5598, lon: 68.7738, isCapital: true },
  "Tajikistan|Khujand": { lat: 40.2828, lon: 69.62, isCapital: false },
  "Tajikistan|Khorog": { lat: 37.4907, lon: 71.553, isCapital: false },
  "Turkmenistan|Ashgabat": { lat: 37.9601, lon: 58.3261, isCapital: true },
  "Turkmenistan|Turkmenbashi": { lat: 40.022, lon: 52.9552, isCapital: false },
  "Turkmenistan|Mary": { lat: 37.6, lon: 61.8333, isCapital: false },
  "Uzbekistan|Tashkent": { lat: 41.2995, lon: 69.2401, isCapital: true },
  "Uzbekistan|Samarkand": { lat: 39.627, lon: 66.975, isCapital: false },
  "Uzbekistan|Bukhara": { lat: 39.7747, lon: 64.4286, isCapital: false },
};

const parseDatasetLocations = () => {
  try {
    const raw = fs.readFileSync(datasetPath, "utf-8");
    const lines = raw.trim().split(/\r?\n/).slice(1); // skip header
    const seen = new Set();

    return lines.reduce((acc, line) => {
      if (!line.trim()) return acc;

      const [country, city] = line.split(",").slice(0, 2);
      if (!country || !city) return acc;

      const key = `${country}|${city}`;
      if (seen.has(key)) return acc;

      const coords = datasetCoordinates[key];
      if (!coords) return acc;

      seen.add(key);
      acc.push({ country, city, ...coords });
      return acc;
    }, []);
  } catch (err) {
    console.error("Failed to load dataset-backed weather locations:", err);
    return [];
  }
};

const getWeatherDatasetLocations = () => {
  const parsed = parseDatasetLocations();
  if (parsed.length) return parsed;

  // Fallback to coordinate map if dataset fails, but still limited to dataset countries
  return Object.entries(datasetCoordinates).map(([key, coords]) => {
    const [country, city] = key.split("|");
    return { country, city, ...coords };
  });
};

router.route("/").get(wrapAsync(listingController.index)).post(
  isLoggedIn,

  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.createListing)
);

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// World time test page
router.get("/worldtime", (req, res) => {
  res.render("listings/worldtime");
});

// Eventbrite events page
router.get("/eventbrite", (req, res) => {
  res.render("listings/eventbrite");
});

// Weather comparison page limited to dataset countries
router.get("/weather-comparison", (req, res) => {
  const datasetLocations = getWeatherDatasetLocations();
  res.render("listings/weather-comparison", { datasetLocations });
});

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,

    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// //index route
// router.get("/", wrapAsync(listingController.index));
//new route
// router.get("/new", isLoggedIn,listingController.renderNewForm);
//show route
// router.get(
//   "/:id",
//   wrapAsync(listingController.showListing)
// );
// //create route
// router.post(
//   "/",
//   isLoggedIn,
//   validateListing,
//   wrapAsync(listingController.createListing)
// );
//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);
//update route
// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.updateListing)
// );
//delete route
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.destroyListing)
// );

module.exports = router;
