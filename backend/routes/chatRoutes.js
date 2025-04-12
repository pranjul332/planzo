const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const GroupChat = require("../db/schema/Chat");
const Trip = require("../db/schema/Trips");
const { getUserInfo } = require("../utils/auth0service");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { jsonrepair } = require("jsonrepair");


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
    const userInfo = await getUserInfo(auth0Id);
     userName = userInfo.name;
    // Create new group chat
    const groupChat = new GroupChat({
      tripId: trip.tripId,
      name: trip.name,
      description: trip.description || "",
      members: [
        // Add trip creator
        {
          auth0Id,
          name: userName,
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
    authId =auth0Id

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
// Save or update trip costs for a group chat
router.post('/:chatId/trip-costs', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { costs } = req.body;
    const auth0Id = req.userId;

    // Find the group chat and ensure the user is a member
    const groupChat = await GroupChat.findOne({
      chatId,
      "members.auth0Id": auth0Id
    });

    if (!groupChat) {
      return res
        .status(404)
        .json({ message: "Group chat not found or access denied" });
    }

    // Validate and transform costs
    const validCosts = [
      { category: 'travel', amount: costs.travel || 0 },
      { category: 'stay', amount: costs.stay || 0 },
      { category: 'food', amount: costs.food || 0 },
      { category: 'activities', amount: costs.activities || 0 }
    ].map(cost => ({
      ...cost,
      percentage: Math.round((cost.amount / (costs.travel + costs.stay + costs.food + costs.activities)) * 100) || 0
    }));

    // Calculate total cost
    const totalCost = validCosts.reduce((sum, cost) => sum + cost.amount, 0);

    // Update group chat with trip costs
    groupChat.tripCosts = {
      categories: validCosts,
      totalCost
    };

    await groupChat.save();

    res.status(200).json({
      message: "Trip costs saved successfully",
      tripCosts: groupChat.tripCosts
    });
  } catch (error) {
    console.error('Error saving trip costs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get trip costs for a group chat
router.get('/:chatId/trip-costs', async (req, res) => {
  try {
    const { chatId } = req.params;
    const auth0Id = req.userId;

    // Find the group chat and ensure the user is a member
    const groupChat = await GroupChat.findOne({
      chatId,
      "members.auth0Id": auth0Id
    });

    if (!groupChat) {
      return res
        .status(404)
        .json({ message: "Group chat not found or access denied" });
    }

    // Return trip costs
    res.status(200).json(groupChat.tripCosts || { 
      categories: [], 
      totalCost: 0 
    });
  } catch (error) {
    console.error('Error fetching trip costs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a new note to a group chat
router.post('/:chatId/notes', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { text, isImportant = false } = req.body;
    const auth0Id = req.userId;

    // Find the group chat and ensure the user is a member
    const groupChat = await GroupChat.findOne({
      chatId,
      "members.auth0Id": auth0Id
    });

    if (!groupChat) {
      return res
        .status(404)
        .json({ message: "Group chat not found or access denied" });
    }

    // Create a new note
    const newNote = {
      text,
      isImportant,
      createdAt: new Date(),
      id: new mongoose.Types.ObjectId().toString()
    };

    // Add the note to the group chat's notes
    groupChat.notes.push(newNote);
    await groupChat.save();

    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all notes for a group chat
router.get('/:chatId/notes', async (req, res) => {
  try {
    const { chatId } = req.params;
    const auth0Id = req.userId;

    // Find the group chat and ensure the user is a member
    const groupChat = await GroupChat.findOne({
      chatId,
      "members.auth0Id": auth0Id
    });

    if (!groupChat) {
      return res
        .status(404)
        .json({ message: "Group chat not found or access denied" });
    }

    // Sort notes by importance and creation date (most recent first)
    const sortedNotes = groupChat.notes.sort((a, b) => {
      // First, sort by importance (important notes first)
      if (a.isImportant !== b.isImportant) {
        return b.isImportant - a.isImportant;
      }
      // Then, sort by creation date (most recent first)
      return b.createdAt - a.createdAt;
    });

    res.status(200).json(sortedNotes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a specific note
router.put('/:chatId/notes/:noteId', async (req, res) => {
  try {
    const { chatId, noteId } = req.params;
    const { text, isImportant } = req.body;
    const auth0Id = req.userId;

    // Find the group chat and ensure the user is a member
    const groupChat = await GroupChat.findOne({
      chatId,
      "members.auth0Id": auth0Id
    });

    if (!groupChat) {
      return res
        .status(404)
        .json({ message: "Group chat not found or access denied" });
    }

    // Find and update the specific note
    const noteIndex = groupChat.notes.findIndex(note => note.id === noteId);

    if (noteIndex === -1) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Update note fields if provided
    if (text !== undefined) {
      groupChat.notes[noteIndex].text = text;
    }
    if (isImportant !== undefined) {
      groupChat.notes[noteIndex].isImportant = isImportant;
    }

    await groupChat.save();

    res.status(200).json(groupChat.notes[noteIndex]);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a specific note
router.delete('/:chatId/notes/:noteId', async (req, res) => {
  try {
    const { chatId, noteId } = req.params;
    const auth0Id = req.userId;

    // Find the group chat and ensure the user is a member
    const groupChat = await GroupChat.findOne({
      chatId,
      "members.auth0Id": auth0Id
    });

    if (!groupChat) {
      return res
        .status(404)
        .json({ message: "Group chat not found or access denied" });
    }

    // Remove the specific note
    groupChat.notes = groupChat.notes.filter(note => note.id !== noteId);

    await groupChat.save();

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// AI Trip Planning Route
router.post('/:chatId/ai-trip', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { destinations, numDays, budget, numMembers, quality } = req.body;
     const auth0Id = req.userId;

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Create prompt for the AI
    const prompt = `As an AI travel planner, create a detailed trip plan for ${numMembers} people visiting ${destinations.join(
      ", "
    )} for ${numDays} days with a budget of $${budget}. The trip quality should be ${quality}. Provide a structured response with specific costs and suggestions for accommodation, activities, food, and transportation. Include a day-by-day itinerary. Return ONLY a JSON object with no additional text or markdown formatting.

The response should follow this exact structure:
{
  "accommodation": {
    "cost": number,
    "suggestions": ["suggestion1", "suggestion2", ...]
  },
  "activities": {
    "cost": number,
    "suggestions": ["activity1", "activity2", ...]
  },
  "food": {
    "cost": number,
    "suggestions": ["food1", "food2", ...]
  },
  "transportation": {
    "cost": number,
    "suggestions": ["transport1", "transport2", ...]
  },
  "totalCost": number,
  "itinerary": ["day 1 plan", "day 2 plan", ...]
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let responseText = response.text();
    
    // Clean up the response text to ensure valid JSON
    responseText = responseText.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      const tripPlan = JSON.parse(responseText);

      // Validate the structure of the parsed JSON
      const requiredFields = [
        "accommodation",
        "activities",
        "food",
        "transportation",
        "totalCost",
        "itinerary",
      ];
      const missingFields = requiredFields.filter((field) => !tripPlan[field]);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      // Save the trip plan to the chat
      const groupChat = await GroupChat.findOne({
        chatId,
        "members.auth0Id": auth0Id,
      });
      if (!groupChat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      // Find the member to get their name
      const member = groupChat.members.find((m) => m.auth0Id === auth0Id);

      // Create a new message with the AI trip plan as an attachment
      const newMessage = {
        sender: auth0Id,
        senderName: member ? member.name : "AI Trip Planner",
        content: "Generated a new trip plan",
        timestamp: new Date(),
        attachments: [
          {
            type: "ai-trip-plan",
            data: tripPlan,
          },
        ],
      };

      // Add the message to the chat
      groupChat.messages.push(newMessage);

      // Also store the trip plan in the dedicated field
      groupChat.aiTripPlan = tripPlan;

      await groupChat.save();

      res.json(tripPlan);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.error('Raw response:', responseText);
      res.status(500).json({ 
        message: 'Error parsing AI response',
        error: parseError.message,
        rawResponse: responseText 
      });
    }
  } catch (error) {
    console.error('Error generating AI trip plan:', error);
    res.status(500).json({ 
      message: 'Error generating trip plan',
      error: error.message 
    });
  }
});



module.exports = router;