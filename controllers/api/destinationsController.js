const Destination = require("../../models/Destination.js");

module.exports.list = async (req, res) => {
  try {
    const { minBudget, maxBudget, duration, type, climate, tags, country } = req.query;
    const q = {};
    if (country) q.country = country;
    if (type) q.type = type;
    if (climate) q.climate = climate;
    if (tags) q.tags = { $in: (Array.isArray(tags) ? tags : String(tags).split(",")).map(t => t.trim()).filter(Boolean) };
    if (minBudget || maxBudget) {
      const min = Number(minBudget) || 0;
      const max = Number(maxBudget) || Number.MAX_SAFE_INTEGER;
      q.minBudget = { $lte: max };
      q.maxBudget = { $gte: min };
    }
    if (duration) q.typicalDuration = Number(duration);

    const items = await Destination.find(q).select("name country type description minBudget maxBudget typicalDuration climate coords attractions hotels emergencyContacts tags images").limit(50);
    return res.json({ items });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.get = async (req, res) => {
  try {
    const item = await Destination.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    return res.json({ item });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.create = async (req, res) => {
  try {
    const created = await Destination.create(req.body);
    return res.status(201).json({ item: created });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

module.exports.update = async (req, res) => {
  try {
    const updated = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    return res.json({ item: updated });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

module.exports.remove = async (req, res) => {
  try {
    const removed = await Destination.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Not found" });
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.hotels = async (req, res) => {
  try {
    const item = await Destination.findById(req.params.id).select("hotels coords country");
    if (!item) return res.status(404).json({ message: "Not found" });
    return res.json({ hotels: item.hotels || [], coords: item.coords, country: item.country });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.emergency = async (req, res) => {
  try {
    const item = await Destination.findById(req.params.id).select("emergencyContacts country");
    if (!item) return res.status(404).json({ message: "Not found" });
    return res.json({ contacts: item.emergencyContacts || [], country: item.country });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};