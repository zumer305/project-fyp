const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/api/worldTimeController.js");

router.get("/", ctrl.getTime);
router.get("/timezones", ctrl.getTimezones);

module.exports = router;
