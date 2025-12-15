const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  group: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Group",
    required: true,
    index: true
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true
  },
  content: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 2000
  },
  type: { 
    type: String, 
    enum: ["text", "system", "location", "image"],
    default: "text" 
  },
  isRead: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true });

// Index for faster queries
messageSchema.index({ group: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);