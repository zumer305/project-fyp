const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/api/mapController.js");

router.get("/nearby", ctrl.nearby);

module.exports = router;