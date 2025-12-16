const Group = require("../../models/group.js");
const Message = require("../../models/message.js");

// Create a new group
module.exports.create = async (req, res) => {
  try {
    const { name, description, destination, startDate, endDate, budget } =
      req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Group name is required" });
    }

    const g = await Group.create({
      name: name.trim(),
      description: description?.trim(),
      destination: destination?.trim(),
      startDate,
      endDate,
      budget,
      creator: req.user.id,
      members: [req.user.id],
    });

    // Populate creator info
    await g.populate("creator", "username email");

    // Create welcome message
    await Message.create({
      group: g._id,
      user: req.user.id,
      content: `Welcome to ${name}! Start planning your trip together.`,
      type: "system",
    });

    return res.status(201).json({
      success: true,
      group: g,
      inviteCode: g.inviteCode,
    });
  } catch (e) {
    console.error("Error creating group:", e);
    return res.status(400).json({ message: e.message });
  }
};

// Join a group using invite code
module.exports.joinByCode = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({ message: "Invite code is required" });
    }

    const group = await Group.findOne({
      inviteCode: inviteCode.toUpperCase(),
    }).populate("members", "username email");

    if (!group) {
      return res.status(404).json({ message: "Invalid invite code" });
    }

    if (!group.isActive) {
      return res
        .status(403)
        .json({ message: "This group is no longer active" });
    }

    // Check if user is already a member
    if (group.members.some((m) => m._id.toString() === req.user.id)) {
      return res.json({
        success: true,
        message: "You are already a member of this group",
        group,
      });
    }

    // Add user to group
    group.members.push(req.user.id);
    await group.save();
    await group.populate("members", "username email");

    // Create system message
    await Message.create({
      group: group._id,
      user: req.user.id,
      content: `${req.user.username} joined the group`,
      type: "system",
    });

    return res.json({
      success: true,
      message: "Successfully joined the group",
      group,
    });
  } catch (e) {
    console.error("Error joining group:", e);
    return res.status(400).json({ message: e.message });
  }
};

// Join group by ID (alternative method)
module.exports.join = async (req, res) => {
  try {
    const g = await Group.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: req.user.id } },
      { new: true }
    ).populate("members", "username email");

    if (!g) return res.status(404).json({ message: "Group not found" });

    // Create system message
    await Message.create({
      group: g._id,
      user: req.user.id,
      content: `${req.user.username} joined the group`,
      type: "system",
    });

    return res.json({ success: true, group: g });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

// Get user's groups
module.exports.getUserGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.user.id,
      isActive: true,
    })
      .populate("creator", "username email")
      .populate("members", "username email")
      .sort({ updatedAt: -1 });

    return res.json({ success: true, groups });
  } catch (e) {
    console.error("Error fetching groups:", e);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get group details
module.exports.getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("creator", "username email")
      .populate("members", "username email");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is a member
    if (!group.members.some((m) => m._id.toString() === req.user.id)) {
      return res
        .status(403)
        .json({ message: "You are not a member of this group" });
    }

    return res.json({ success: true, group });
  } catch (e) {
    console.error("Error fetching group:", e);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get group messages with pagination
module.exports.messages = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    // Verify user is a member
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (!group.members.some((m) => m._id.toString() === req.user.id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const messages = await Message.find({ group: req.params.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username email");

    const total = await Message.countDocuments({ group: req.params.id });

    return res.json({
      success: true,
      messages: messages.reverse(), // Return in ascending order
      total,
      hasMore: skip + limit < total,
    });
  } catch (e) {
    console.error("Error fetching messages:", e);
    return res.status(500).json({ message: "Server error" });
  }
};

// Send a message (alternative to socket.io)
module.exports.sendMessage = async (req, res) => {
  try {
    const { content, type = "text" } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Message content is required" });
    }

    // Verify user is a member
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (!group.members.some((m) => m._id.toString() === req.user.id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const message = await Message.create({
      group: req.params.id,
      user: req.user.id,
      content: content.trim(),
      type,
    });

    await message.populate("user", "username email");

    return res.status(201).json({
      success: true,
      message,
    });
  } catch (e) {
    console.error("Error sending message:", e);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update group details
module.exports.updateGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Only creator can update group
    if (group.creator.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the creator can update group details" });
    }

    const { name, description, destination, startDate, endDate, budget } =
      req.body;

    if (name) group.name = name.trim();
    if (description !== undefined) group.description = description?.trim();
    if (destination !== undefined) group.destination = destination?.trim();
    if (startDate) group.startDate = startDate;
    if (endDate) group.endDate = endDate;
    if (budget) group.budget = budget;

    await group.save();
    await group.populate("creator members", "username email");

    return res.json({ success: true, group });
  } catch (e) {
    console.error("Error updating group:", e);
    return res.status(500).json({ message: "Server error" });
  }
};

// Leave group
module.exports.leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Remove user from members
    group.members = group.members.filter((m) => m.toString() !== req.user.id);

    // If creator leaves and there are other members, transfer ownership
    if (group.creator.toString() === req.user.id && group.members.length > 0) {
      group.creator = group.members[0];
    }

    // If no members left, deactivate group
    if (group.members.length === 0) {
      group.isActive = false;
    }

    await group.save();

    // Create system message
    await Message.create({
      group: group._id,
      user: req.user.id,
      content: `${req.user.username} left the group`,
      type: "system",
    });

    return res.json({
      success: true,
      message: "Successfully left the group",
    });
  } catch (e) {
    console.error("Error leaving group:", e);
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

// Update user location
module.exports.updateLocation = async (req, res) => {
  try {
    const { longitude, latitude, sharingEnabled = true } = req.body;

    if (!longitude || !latitude) {
      return res.status(400).json({ message: "Longitude and latitude are required" });
    }

    // Validate coordinates
    if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
      return res.status(400).json({ message: "Invalid coordinates" });
    }

    const User = require("../../models/user.js");
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.location = {
      type: 'Point',
      coordinates: [longitude, latitude],
      lastUpdated: new Date(),
      sharingEnabled
    };

    await user.save();

    return res.json({
      success: true,
      message: "Location updated successfully",
      location: user.location
    });
  } catch (e) {
    console.error("Error updating location:", e);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get member locations for a group
module.exports.getMemberLocations = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is a member
    if (!group.members.some((m) => m._id.toString() === req.user.id)) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    const User = require("../../models/user.js");
    
    // Get all members with their locations
    const members = await User.find(
      { 
        _id: { $in: group.members },
        'location.sharingEnabled': true
      },
      'username email location'
    );

    // Filter and format the response
    const locations = members
      .filter(member => 
        member.location && 
        member.location.coordinates && 
        member.location.coordinates[0] !== 0 && 
        member.location.coordinates[1] !== 0
      )
      .map(member => ({
        userId: member._id,
        username: member.username,
        coordinates: member.location.coordinates,
        lastUpdated: member.location.lastUpdated
      }));

    return res.json({
      success: true,
      locations
    });
  } catch (e) {
    console.error("Error fetching member locations:", e);
    return res.status(500).json({ message: "Server error" });
  }
};
