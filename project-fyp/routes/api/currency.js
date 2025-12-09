const express = require("express");
const router = express.Router();
const currencyController = require("../../controllers/api/currencyController");
const wrapAsync = require("../../utils/wrapAsync");

// GET /api/currency/symbols - Get all supported currencies
router.get("/symbols", wrapAsync(currencyController.getSupportedCurrencies));

// GET /api/currency/latest - Get latest exchange rates
router.get("/latest", wrapAsync(currencyController.getLatestRates));

// GET /api/currency/convert - Convert currency
router.get("/convert", wrapAsync(currencyController.convertCurrency));

// GET /api/currency/historical - Get historical rates
router.get("/historical", wrapAsync(currencyController.getHistoricalRates));

module.exports = router;
