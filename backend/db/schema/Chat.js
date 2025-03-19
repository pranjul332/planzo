const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  attachments: [
    {
      type: String,
    },
  ],
});
const groupChatSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      default: uuidv4,
      unique: true,
      required: true,
      index: true,
    },
    tripId: {
      type: String,
      required: true,
      ref: "Trip",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    members: [
      {
        auth0Id: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          default: "Member",
        },
      },
    ],
    messages: [messageSchema],
    settings: {
      notifications: {
        type: String,
        enum: ["all", "mentions", "none"],
        default: "all",
      },
      privacy: {
        type: String,
        enum: ["public", "private"],
        default: "public",
      },
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("GroupChat", groupChatSchema);
