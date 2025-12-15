const mongoose = require("mongoose");
const crypto = require("crypto");

const groupSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  inviteCode: {
    type: String,
    unique: true,
    index: true
  },
  creator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true
  },
  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }],
  destination: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  budget: {
    amount: { type: Number },
    currency: { type: String, default: "USD" }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Generate unique invite code before validation
groupSchema.pre("validate", async function(next) {
  if (!this.inviteCode) {
    // Generate initial code
    this.inviteCode = crypto.randomBytes(4).toString("hex").toUpperCase();
    
    // Ensure uniqueness
    const Group = mongoose.model("Group");
    let exists = await Group.findOne({ inviteCode: this.inviteCode });
    let attempts = 0;
    
    while (exists && attempts < 10) {
      this.inviteCode = crypto.randomBytes(4).toString("hex").toUpperCase();
      exists = await Group.findOne({ inviteCode: this.inviteCode });
      attempts++;
    }
  }
  next();
});

module.exports = mongoose.model("Group", groupSchema);