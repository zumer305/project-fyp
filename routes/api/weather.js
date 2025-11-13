const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/api/weatherController.js");

router.get("/current", ctrl.current);
router.get("/forecast", ctrl.forecast);

module.exports = router;