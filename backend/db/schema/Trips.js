const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
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
    description: String,
    budget: Number,
    members: [memberSchema], // Corrected to use memberSchema instead of an array of strings
    auth0Id: {
      type: String,
      required: true, // Ensures only the user who created it can modify it
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
 