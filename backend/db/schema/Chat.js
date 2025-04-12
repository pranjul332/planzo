const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const attachmentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["image", "file", "ai-trip-plan"],
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: false }
);

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
  attachments: [attachmentSchema],
});

const tripCostSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["travel", "stay", "food", "activities"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  { _id: false }
);

const noteSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
      unique: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isImportant: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const aiTripPlanSchema = new mongoose.Schema(
  {
    accommodation: {
      cost: Number,
      suggestions: [String],
    },
    activities: {
      cost: Number,
      suggestions: [String],
    },
    food: {
      cost: Number,
      suggestions: [String],
    },
    transportation: {
      cost: Number,
      suggestions: [String],
    },
    totalCost: Number,
    itinerary: [String],
  },
  { _id: false }
);

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

    destinations: [
      {
        name: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          required: true,
        },
        days: {
          type: Number,
          required: true,
        },
        attractions: [String],
        notes: {
          type: String,
        },
      },
    ],
    tripCosts: {
      categories: [tripCostSchema],
      totalCost: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    notes: [noteSchema],

    aiTripPlan: aiTripPlanSchema,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("GroupChat", groupChatSchema);
