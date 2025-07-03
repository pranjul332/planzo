const express = require("express");
const router = express.Router();
const Trip = require("../db/schema/Trips");
const GroupChat = require("../db/schema/Chat")
const TripInvitation = require("../db/schema/TripInvite")
const { v4: uuidv4 } = require("uuid"); 
const {getUserInfo} =require("../utils/auth0service")


// Get all trips for the current user
router.get("/", async (req, res) => {
  try {
    // Find trips created by the user, sorted by newest first
    const createdTrips = await Trip.find({ auth0Id: req.userId }).sort({
      createdAt: -1,
    });

    // Find trips where the user is a member, sorted by newest first
    const joinedTrips = await Trip.find({
      "members.auth0Id": req.userId,
      auth0Id: { $ne: req.userId }, // Exclude trips user created (to avoid duplicates)
    }).sort({ createdAt: -1 });

    // Combine both sets of trips
    const allTrips = [
      ...createdTrips.map((trip) => ({
        ...trip.toObject(),
        id: trip.tripId,
        isOwner: true,
      })),
      ...joinedTrips.map((trip) => ({
        ...trip.toObject(),
        id: trip.tripId,
        isOwner: false,
      })),
    ];

    res.json(allTrips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get a specific trip
router.get("/:tripId", async (req, res) => {
  try {
    const trip = await Trip.findOne({
      tripId: req.params.tripId,
      $or: [{ auth0Id: req.userId }, { "members.auth0Id": req.userId }],
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json({
      ...trip.toObject(),
      id: trip.tripId,
      isOwner: trip.auth0Id === req.userId,
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
      members = [],
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
      $or: [{ auth0Id: req.userId }, { "members.auth0Id": req.userId }],
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Update allowed fields
    const updateFields = isOwner
      ? [
          "name",
          "mainDestination",
          "startDate",
          "endDate",
          "description",
          "budget",
          "members",
        ]
      : ["members"]; // Non-owners can only modify members (or whatever subset you decide)

    updateFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        trip[field] = req.body[field];
      }
    });

    const updatedTrip = await trip.save();

    res.json({
      ...updatedTrip.toObject(),
      id: updatedTrip.tripId,
      isOwner,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a trip
router.delete("/:tripId", async (req, res) => {
  try {
    // Only the owner can delete a trip
    const trip = await Trip.findOneAndDelete({
      tripId: req.params.tripId,
      auth0Id: req.userId,
    });

    if (!trip) {
      return res
        .status(404)
        .json({ message: "Trip not found or not authorized to delete" });
    }

    res.json({
      message: "Trip deleted successfully",
      id: trip.tripId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/:tripId/invite", async (req, res) => {
  try {
    const { tripId } = req.params;
    const auth0Id = req.userId;

    // Check if trip exists and user has access
    const trip = await Trip.findOne({ tripId, auth0Id });
    if (!trip) {
      return res
        .status(404)
        .json({ message: "Trip not found or access denied" });
    }

    // Generate a unique invitation code
    const inviteCode = uuidv4();

    // Store the invitation in the database with an expiration
    const invitation = new TripInvitation({
      tripId,
      inviteCode,
      createdBy: auth0Id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiration
    });

    await invitation.save();

    // Generate the shareable link using your frontend URL
    const frontendUrl =
      process.env.REACT_APP_FRONTEND_URL || "https://pl-anzo.vercel.app";
    const inviteLink = `${frontendUrl}/invite/${inviteCode}`;

    res.status(201).json({ inviteLink, inviteCode });
  } catch (error) {
    console.error("Error generating invitation link:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a route to get invitation details (public route - no authentication required)
router.get("/invite/:inviteCode", async (req, res) => {
  try {
    const { inviteCode } = req.params;

    const invitation = await TripInvitation.findOne({
      inviteCode,
      expiresAt: { $gt: new Date() },
      accepted: false,
    });

    if (!invitation) {
      return res
        .status(404)
        .json({ message: "Invitation not found or expired" });
    }

    // Get trip details
    const trip = await Trip.findOne({ tripId: invitation.tripId });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json({
      tripId: trip.tripId,
      tripName: trip.name,
      tripDescription: trip.description,
      tripLocation: trip.location,
      tripDates: trip.dates,
      inviteCode,
      expiresAt: invitation.expiresAt,
    });
  } catch (error) {
    console.error("Error fetching invitation details:", error);
    res.status(500).json({ message: "Failed to fetch invitation details" });
  }
});

// Accept invitation route
router.post("/invite/:inviteCode/accept", async (req, res) => {
  try {
    const { inviteCode } = req.params;
    const auth0Id = req.userId;
    console.log(auth0Id);

    // Find the invitation
    const invitation = await TripInvitation.findOne({
      inviteCode,
      expiresAt: { $gt: new Date() },
    });

    if (!invitation) {
      return res
        .status(404)
        .json({ message: "Invitation not found or expired" });
    }

    // Get the trip
    const trip = await Trip.findOne({ tripId: invitation.tripId });
    const chat = await GroupChat.findOne({ tripId: invitation.tripId });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Try to get user info, fall back to default if it fails
    let userName = "New Member";
    try {
      const userInfo = await getUserInfo(auth0Id);
      userName = userInfo.name || userInfo.nickname || "New Member";
    } catch (error) {
      console.warn(
        `Could not fetch Auth0 user info: ${error.message}. Using default name.`
      );
    }

    // Check if user is already a member
    const isAlreadyMember = trip.members.some(
      (member) => member.auth0Id === auth0Id
    );

    if (isAlreadyMember) {
      return res
        .status(400)
        .json({ message: "You are already a member of this trip" });
    }

    // Add user to trip members
    trip.members.push({
      auth0Id: auth0Id,
      name: userName,
      role: "Member",
    });

    // Add user to chat if chat exists
    if (chat) {
      chat.members.push({
        auth0Id: auth0Id,
        name: userName,
        role: "Member",
      });
      await chat.save();
    }

    await trip.save();

    // Mark invitation as accepted
    invitation.accepted = true;
    invitation.acceptedBy = auth0Id;
    invitation.acceptedAt = new Date();
    await invitation.save();

    res.status(200).json({
      message: "Successfully joined the trip",
      tripId: trip.tripId,
      tripName: trip.name,
    });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    res.status(500).json({ message: "Server error" });
  }
});
 
module.exports = router;
