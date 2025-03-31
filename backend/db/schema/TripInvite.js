const mongoose = require("mongoose");

const tripInvitationSchema = new mongoose.Schema({
  tripId: {
    type: String,
    required: true,
    ref: "Trip",
  },
  inviteCode: {
    type: String,
    required: true,
    unique: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true,
  },
  accepted: {
    type: Boolean,
    default: false,
  },
  acceptedBy: {
    type: String,
  },
  acceptedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("TripInvitation", tripInvitationSchema);
