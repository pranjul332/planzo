const express = require("express");
const router = express.Router();
const Trip = require("../db/schema/Trips");
const { v4: uuidv4 } = require("uuid");

// Get all trips for the current user
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find({ auth0Id: req.userId });
    res.json(
      trips.map((trip) => ({
        ...trip.toObject(),
        id: trip.tripId, // Ensure frontend gets the unique tripId
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific trip
router.get("/:tripId", async (req, res) => {
  try {
    const trip = await Trip.findOne({
      tripId: req.params.tripId,
      auth0Id: req.userId,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json({
      ...trip.toObject(),
      id: trip.tripId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new trip
router.post("/", async (req, res) => {
  try {
    const {
      name,
      mainDestination,
      startDate,
      endDate,
      description,
      budget,
      members,
      requestId,
    } = req.body;

    // Check for duplicate request
    if (requestId) {
      const existingTrip = await Trip.findOne({
        requestId,
        auth0Id: req.userId,
      });

      if (existingTrip) {
        return res.status(200).json({
          ...existingTrip.toObject(),
          id: existingTrip.tripId,
        });
      }
    }

    // Generate a new unique tripId
    const tripId = uuidv4();

    const trip = new Trip({
      tripId, // Explicitly set the tripId
      name,
      mainDestination,
      startDate,
      endDate,
      description,
      budget,
      members,
      requestId,
      auth0Id: req.userId,
    });

    const savedTrip = await trip.save();

    res.status(201).json({
      ...savedTrip.toObject(),
      id: savedTrip.tripId,
    });
  } catch (error) {
    console.error("Trip creation error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update a trip
router.put("/:tripId", async (req, res) => {
  try {
    const trip = await Trip.findOne({
      tripId: req.params.tripId,
      auth0Id: req.userId,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Update allowed fields
    const updateFields = [
      "name",
      "mainDestination",
      "startDate",
      "endDate",
      "description",
      "budget",
      "members",
    ];

    updateFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        trip[field] = req.body[field];
      }
    });

    const updatedTrip = await trip.save();

    res.json({
      ...updatedTrip.toObject(),
      id: updatedTrip.tripId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a trip
router.delete("/:tripId", async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      tripId: req.params.tripId,
      auth0Id: req.userId,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json({
      message: "Trip deleted successfully",
      id: trip.tripId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
