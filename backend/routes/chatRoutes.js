const express = require("express");
const router = express.Router();
const GroupChat = require("../db/schema/Chat");
const Trip = require("../db/schema/Trips");

// Create a new group chat for a trip
router.post("/:tripId", async (req, res) => {
  try {
    const { tripId } = req.params;
    const auth0Id = req.userId; // Use req.userId set by authMiddleware
    // Check if trip exists and user has access
    const trip = await Trip.findOne({ tripId, auth0Id });
    if (!trip) {
      return res
        .status(404)
        .json({ message: "Trip not found or access denied" });
    }

    // Create new group chat
    const groupChat = new GroupChat({
      tripId: trip.tripId,
      name: trip.name,
      description: trip.description || "",
      members: [
        // Add trip creator
        {
          auth0Id,
          name:  "Trip Creator",
          role: "Admin",
        },
        // Add all trip members
        ...trip.members.map((member) => ({
          auth0Id: member.auth0Id || auth0Id, // Fallback to creator if no auth0Id
          name: member.name,
          role: member.role,
        })),
      ],
      settings: {
        notifications: "all",
        privacy: "public",
      },
    });

    await groupChat.save();
    res.status(201).json(groupChat);
  } catch (error) {
    console.error("Error creating group chat:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get group chat by tripId
router.get("/trip/:tripId", async (req, res) => {
  try {
    const { tripId } = req.params;
    const auth0Id = req.userId;

    // Find a group chat associated with the trip where the user is a member
    const groupChat = await GroupChat.findOne({
      tripId,
      "members.auth0Id": auth0Id,
    });

    if (!groupChat) {
      return res.status(404).json({ message: "No group chat found for this trip" });
    }

    res.json(groupChat);
  } catch (error) {
    console.error("Error fetching group chat by trip ID:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all group chats for a user
router.get("/", async (req, res) => {
  try {
    const auth0Id = req.userId;
    const groupChats = await GroupChat.find({ "members.auth0Id": auth0Id });
    res.json(groupChats);
  } catch (error) {
    console.error("Error fetching group chats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get specific group chat
router.get("/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;
    const auth0Id = req.userId;

    const groupChat = await GroupChat.findOne({
      chatId,
      "members.auth0Id": auth0Id,
    });

    if (!groupChat) {
      return res
        .status(404)
        .json({ message: "Group chat not found or access denied" });
    }

    res.json(groupChat);
  } catch (error) {
    console.error("Error fetching group chat:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Send a message to a group chat
router.post("/:chatId/messages", async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, attachments } = req.body;
    const auth0Id = req.userId;

    const groupChat = await GroupChat.findOne({
      chatId,
      "members.auth0Id": auth0Id,
    });

    if (!groupChat) {
      return res
        .status(404)
        .json({ message: "Group chat not found or access denied" });
    }

    // Find the member to get their name
    const member = groupChat.members.find((m) => m.auth0Id === auth0Id);

    const newMessage = {
      sender: auth0Id,
      senderName: member ? member.name : "Unknown User",
      content,
      timestamp: new Date(),
      attachments: attachments || [],
    };

    groupChat.messages.push(newMessage);
    await groupChat.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update group chat settings
router.put("/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;
    const { name, description, settings } = req.body;
    const auth0Id = req.userId;

    // Find the group chat and ensure the user is an admin
    const groupChat = await GroupChat.findOne({
      chatId,
      "members.auth0Id": auth0Id,
    });

    if (!groupChat) {
      return res
        .status(404)
        .json({ message: "Group chat not found or access denied" });
    }

    // Check if user is admin
    const member = groupChat.members.find((m) => m.auth0Id === auth0Id);
    if (!member || member.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Only admins can update group settings" });
    }

    // Update the group chat
    if (name) groupChat.name = name;
    if (description) groupChat.description = description;
    if (settings) groupChat.settings = { ...groupChat.settings, ...settings };

    await groupChat.save();
    res.json(groupChat);
  } catch (error) {
    console.error("Error updating group chat:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add destinations to a group chat
router.post('/:chatId/destinations', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { destinations } = req.body;

    const groupChat = await GroupChat.findOne({ chatId });

    if (!groupChat) {
      return res.status(404).json({ message: 'Group chat not found' });
    }

    // Validate destinations
    const validDestinations = destinations.map(dest => ({
      name: dest.name,
      country: dest.country,
      days: dest.days,
      attractions: dest.attractions || [],
      notes: dest.notes || ''
    }));

    // Replace existing destinations or append
    groupChat.destinations = validDestinations;

    await groupChat.save();

    res.status(200).json(groupChat.destinations);
  } catch (error) {
    console.error('Error adding destinations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get destinations for a group chat
router.get('/:chatId/destinations', async (req, res) => {
  try {
    const { chatId } = req.params;

    const groupChat = await GroupChat.findOne({ chatId });

    if (!groupChat) {
      return res.status(404).json({ message: 'Group chat not found' });
    }

    res.status(200).json(groupChat.destinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
