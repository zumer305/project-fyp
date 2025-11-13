const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../../middleware/jwt.js");
const ctrl = require("../../controllers/api/destinationsController.js");

router.get("/", ctrl.list);
router.get("/:id", ctrl.get);

// Admin CRUD
router.post("/", requireAuth, requireRole("admin"), ctrl.create);
router.put("/:id", requireAuth, requireRole("admin"), ctrl.update);
router.delete("/:id", requireAuth, requireRole("admin"), ctrl.remove);

// Hotels and Emergency info
router.get("/:id/hotels", ctrl.hotels);
router.get("/:id/emergency", ctrl.emergency);

module.exports = router;