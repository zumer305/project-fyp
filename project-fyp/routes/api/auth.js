const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../middleware/jwt.js");
const auth = require("../../controllers/api/authController.js");

router.post("/login", auth.login);
router.post("/signup", auth.signup);
router.post("/logout", auth.logout);
router.get("/me", requireAuth, auth.me);

module.exports = router;