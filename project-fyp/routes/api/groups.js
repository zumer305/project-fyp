const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../middleware/jwt.js");
const ctrl = require("../../controllers/api/groupsController.js");

// Group management
router.post("/", requireAuth, ctrl.create);
router.get("/", requireAuth, ctrl.getUserGroups);
router.get("/:id", requireAuth, ctrl.getGroup);
router.put("/:id", requireAuth, ctrl.updateGroup);
router.post("/:id/join", requireAuth, ctrl.join);
router.post("/join-code", requireAuth, ctrl.joinByCode);
router.post("/:id/leave", requireAuth, ctrl.leaveGroup);

// Messages
router.get("/:id/messages", requireAuth, ctrl.messages);
router.post("/:id/messages", requireAuth, ctrl.sendMessage);

// Trip planning features
router.get("/:id/plan", requireAuth, ctrl.plan);
router.get("/:id/expenses", requireAuth, ctrl.expenses);

module.exports = router;