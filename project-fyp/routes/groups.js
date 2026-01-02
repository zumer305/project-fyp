const express = require("express");
const router = express.Router();
const Group = require("../models/group.js");

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
}

// Groups index page
router.get("/", isLoggedIn, (req, res) => {
  res.render("groups/index.ejs");
});

// Group chat page
router.get("/:id/chat", isLoggedIn, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      req.flash("error", "Group not found");
      return res.redirect("/groups");
    }

    // Check if user is a member
    const isMember = group.members.some(
      (memberId) => memberId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      req.flash("error", "You are not a member of this group");
      return res.redirect("/groups");
    }

    res.render("groups/chat.ejs", { 
      groupId: req.params.id,
      disableChatbot: true 
    });
  } catch (error) {
    console.error("Error loading group chat:", error);
    req.flash("error", "Error loading group chat");
    res.redirect("/groups");
  }
});

// Location map page
router.get("/:id/location-map", isLoggedIn, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      req.flash("error", "Group not found");
      return res.redirect("/groups");
    }

    // Check if user is a member
    const isMember = group.members.some(
      (memberId) => memberId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      req.flash("error", "You are not a member of this group");
      return res.redirect("/groups");
    }

    res.render("groups/location-map.ejs", { groupId: req.params.id });
  } catch (error) {
    console.error("Error loading location map:", error);
    req.flash("error", "Error loading location map");
    res.redirect("/groups");
  }
});

module.exports = router;
