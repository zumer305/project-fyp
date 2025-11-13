const Group = require("../../models/group.js");
const Message = require("../../models/message.js");

module.exports.create = async (req, res) => {
  try {
    const g = await Group.create({
      name: req.body.name,
      members: [req.user.id],
    });
    return res.status(201).json({ group: g });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

module.exports.join = async (req, res) => {
  try {
    const g = await Group.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: req.user.id } },
      { new: true }
    );
    if (!g) return res.status(404).json({ message: "Group not found" });
    return res.json({ group: g });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

module.exports.messages = async (req, res) => {
  try {
    const msgs = await Message.find({ group: req.params.id })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("user", "username");
    return res.json({ messages: msgs });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.plan = async (req, res) => {
  try {
    const groupId = req.params.id;
    // Stub itinerary; later derive from destinations selected by group
    const itinerary = [
      { day: 1, title: "City Tour", notes: "Museums, parks, local market" },
      { day: 2, title: "Nature Trip", notes: "Ala Archa Park hiking" },
      {
        day: 3,
        title: "Cultural Day",
        notes: "Historical sites and food tour",
      },
    ];
    return res.json({ groupId, itinerary });
  } catch (e) {
    return res.status(500).json({ message: "Failed to load plan" });
  }
};

module.exports.expenses = async (req, res) => {
  try {
    const groupId = req.params.id;
    // Stub summary; later compute from stored expenses
    const summary = {
      total: 420,
      perMember: 140,
      currency: "USD",
      items: [
        { label: "Transport", amount: 120 },
        { label: "Food", amount: 180 },
        { label: "Attractions", amount: 120 },
      ],
    };
    return res.json({ groupId, summary });
  } catch (e) {
    return res.status(500).json({ message: "Failed to load expenses" });
  }
};
