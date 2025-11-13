const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../middleware/jwt.js");
const ctrl = require("../../controllers/api/groupsController.js");

router.post("/", requireAuth, ctrl.create);
router.post("/:id/join", requireAuth, ctrl.join);
router.get("/:id/messages", requireAuth, ctrl.messages);
router.get("/:id/plan", requireAuth, ctrl.plan);
router.get("/:id/expenses", requireAuth, ctrl.expenses);

module.exports = router;