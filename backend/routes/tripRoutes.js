// routes/tripRoutes.js
const express = require("express");
const router = express.Router();
const Trip = require("../db/schema/Trips");

// Get all trips for the current user
router.get("/", async (req, res) => {
  try {
    // req.userId now contains the Auth0 ID (sub) from the token
    const trips = await Trip.find({ auth0Id: req.userId });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific trip
router.get("/:id", async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      auth0Id: req.userId, // Ensure user only sees their own trips
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new trip
// Create a new trip with duplicate prevention
router.post("/", async (req, res) => {
  try {
    const { name, mainDestination, startDate, endDate, activities, notes, members, requestId } = req.body;

    console.log("🔹 Incoming trip creation request:", req.body);

    // Check if we've already processed this request
    if (requestId) {
      const existingTrip = await Trip.findOne({ 
        requestId, 
        auth0Id: req.userId 
      });
      
      if (existingTrip) {
        console.log("Duplicate request detected, returning existing trip");
        return res.status(200).json(existingTrip);
      }
    }

    const trip = new Trip({
      name,
      mainDestination,
      startDate,
      endDate,
      activities,
      notes,
      members,
      requestId, // Store the request ID to detect duplicates
      auth0Id: req.userId, // Store Auth0 ID instead of MongoDB user ID
    });

    const savedTrip = await trip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Update a trip
router.put("/:id", async (req, res) => {
  try {
    const { title, destination, startDate, endDate, activities, notes } =
      req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      auth0Id: req.userId,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (title) trip.title = title;
    if (destination) trip.destination = destination;
    if (startDate) trip.startDate = startDate;
    if (endDate) trip.endDate = endDate;
    if (activities) trip.activities = activities;
    if (notes) trip.notes = notes;

    const updatedTrip = await trip.save();
    res.json(updatedTrip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a trip
router.delete("/:id", async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      auth0Id: req.userId,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
