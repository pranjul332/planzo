const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const memberSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    // required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "Member",
  },
});

const tripSchema = new mongoose.Schema(
  {
    // Add a unique trip ID field
    tripId: {
      type: String,
      default: uuidv4,
      unique: true,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    mainDestination: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
    },
    budget: {
      type: Number,
    },
    members: [memberSchema],
    auth0Id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to ensure unique tripId
tripSchema.pre("save", async function (next) {
  if (!this.tripId) {
    this.tripId = uuidv4();
  }
  next();
});

module.exports = mongoose.model("Trip", tripSchema);
