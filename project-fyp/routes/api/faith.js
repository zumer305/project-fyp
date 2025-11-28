const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/api/faithController.js");

router.get("/mosques", ctrl.mosques);
router.get("/qiblah", ctrl.qiblah);
router.get("/halal", ctrl.halal);

module.exports = router;