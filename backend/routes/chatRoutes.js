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

router.post("/:chatId/messages", async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, attachments } = req.body;
    const auth0Id = req.userId;

    const groupChat = await GroupChat.findOne({
      chatId: chatId,
      "members.auth0Id": auth0Id,
    });

    if (!groupChat) {
      return res
        .status(404)
        .json({ message: "Group chat not found or access denied" });
    }

    const member = groupChat.members.find((m) => m.auth0Id === auth0Id);

    const newMessage = {
      _id: new mongoose.Types.ObjectId(),
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

router.get("/:chatId/messages", async (req, res) => {
  try {
    const { chatId } = req.params;
    const auth0Id = req.userId;

    const groupChat = await GroupChat.findOne({
      chatId: chatId,
      "members.auth0Id": auth0Id,
    });

    if (!groupChat) {
      return res
        .status(404)
        .json({ message: "Group chat not found or access denied" });
    }

    res.json(groupChat.messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    // Create prompt for the AI
    const prompt = `As an AI travel planner, create a detailed trip plan for ${numMembers} people visiting ${destinations.join(
      ", "
    )} for ${numDays} days with a budget of ₹${budget}. The trip quality should be ${quality}. 
    IMPORTANT: ALL costs MUST be provided in Indian Rupees (INR) only. Include the ₹ symbol before each numerical cost value.
    Provide a structured response with specific costs and suggestions for accommodation, activities, food, and transportation. Include a day-by-day itinerary. Return ONLY a JSON object with no additional text or markdown formatting.

The response should follow this exact structure:
{
  "accommodation": {
    "cost": number, // Total cost in INR (without ₹ symbol in this field)
    "suggestions": ["₹X per night for Hotel A", "₹Y per night for Airbnb B", ...]
  },
  "activities": {
    "cost": number, // Total cost in INR (without ₹ symbol in this field)
    "suggestions": ["₹X for Activity 1", "₹Y for Activity 2", ...]
  },
  "food": {
    "cost": number, // Total cost in INR (without ₹ symbol in this field)
    "suggestions": ["₹X per meal at Restaurant A", "₹Y for street food options", ...]
  },
  "transportation": {
    "cost": number, // Total cost in INR (without ₹ symbol in this field)
    "suggestions": ["₹X for local transport", "₹Y for taxi services", ...]
  },
  "totalCost": number, // Total trip cost in INR (without ₹ symbol in this field)
  "itinerary": [
    "Day 1: [detailed plan with costs in INR]", 
    "Day 2: [detailed plan with costs in INR]", 
    ...
  ]
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

// AI Trip Suggestions Route
router.post('/:chatId/ai-suggestions', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { city, categories } = req.body;
    const auth0Id = req.userId;

    // Validate request
    if (!city || !categories || !Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ 
        message: 'City and at least one suggestion category are required' 
      });
    }

    // Find the group chat and ensure the user is a member
    const groupChat = await GroupChat.findOne({
      chatId,
      "members.auth0Id": auth0Id
    });

    if (!groupChat) {
      return res.status(404).json({ 
        message: "Group chat not found or access denied" 
      });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }); // Using the free version

    // Create prompt for the AI based on the city and selected categories
    const categoriesText = categories.join(", ");
    const prompt = `As a travel expert, provide detailed, specific, and helpful suggestions about ${city} for the following categories: ${categoriesText}. 
    
For each category, provide at least 3 specific suggestions that are tailored to ${city}.
IMPORTANT: ALL costs MUST be provided in Indian Rupees (INR) only. Include the ₹ symbol before each numerical cost value.

If "medical" is included in the categories, provide essential medical supplies and health precautions specifically needed for ${city}, considering its climate, altitude, disease risks, and local healthcare access. Include items like specific medications, first aid supplies (like glucose packets for hot regions), vaccination requirements, and health precautions.

If "protips" is included in the categories, provide insider travel tips that aren't commonly found in guidebooks but would significantly improve a traveler's experience in ${city}, such as lesser-known spots, best times to visit popular attractions, local etiquette, useful apps or websites, packing hacks, or money-saving tricks.
    
Format your response as a JSON object with no additional text or explanations, with this exact structure:

{
  "suggestions": [
    {
      "category": "category name",
      "items": [
        {
          "title": "short title",
          "description": "detailed suggestion"
        },
        // more items...
      ]
    },
    // more categories...
  ]
}`;

    // Generate content with Gemini
    const result = await model.generateContent(prompt);
    const response = result.response;
    let responseText = response.text();
    
    // Clean up the response text to ensure valid JSON
    responseText = responseText.replace(/```json\n?|\n?```/g, '').trim();
    
    let suggestionsData;
    try {
      // Parse the JSON response
      suggestionsData = JSON.parse(responseText);
      
      // Validate structure
      if (!suggestionsData.suggestions || !Array.isArray(suggestionsData.suggestions)) {
        throw new Error("Invalid response structure");
      }
      
      // Find the member to get their name
      const member = groupChat.members.find(m => m.auth0Id === auth0Id);
      
      // Create a new message with the AI suggestions as an attachment
      const newMessage = {
        sender: auth0Id,
        senderName: member ? member.name : "Unknown User",
        content: `Generated travel suggestions for ${city}`,
        timestamp: new Date(),
        attachments: [
          {
            type: "ai-trip-plan",
            data: {
              city,
              categories: categories,
              suggestions: suggestionsData.suggestions
            }
          }
        ]
      };
      
      // Add the message to the chat
      groupChat.messages.push(newMessage);
      await groupChat.save();
      
      res.json({
        city,
        categories,
        suggestions: suggestionsData.suggestions
      });
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.error('Raw response:', responseText);
      
      // Try to repair the JSON
      try {
        const repairedJson = jsonrepair(responseText);
        suggestionsData = JSON.parse(repairedJson);
        
        if (!suggestionsData.suggestions || !Array.isArray(suggestionsData.suggestions)) {
          throw new Error("Invalid response structure after repair");
        }
        
        // Find the member to get their name
        const member = groupChat.members.find(m => m.auth0Id === auth0Id);
        
        // Create a new message with the AI suggestions as an attachment
        const newMessage = {
          sender: auth0Id,
          senderName: member ? member.name : "Unknown User",
          content: `Generated travel suggestions for ${city}`,
          timestamp: new Date(),
          attachments: [
            {
              type: "ai-trip-plan",
              data: {
                city,
                categories: categories,
                suggestions: suggestionsData.suggestions
              }
            }
          ]
        };
        
        // Add the message to the chat
        groupChat.messages.push(newMessage);
        await groupChat.save();
        
        res.json({
          city,
          categories,
          suggestions: suggestionsData.suggestions
        });
      } catch (repairError) {
        res.status(500).json({ 
          message: 'Error processing AI response',
          error: parseError.message,
          rawResponse: responseText 
        });
      }
    }
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    res.status(500).json({ 
      message: 'Error generating travel suggestions',
      error: error.message 
    });
  }
});
 
// Get saved AI suggestions for a specific city
router.get('/:chatId/ai-suggestions/:city', async (req, res) => {
  try {
    const { chatId, city } = req.params;
    const auth0Id = req.userId;

    // Find the group chat and ensure the user is a member
    const groupChat = await GroupChat.findOne({
      chatId,
      "members.auth0Id": auth0Id
    });

    if (!groupChat) {
      return res.status(404).json({ 
        message: "Group chat not found or access denied" 
      });
    }

    // Find messages with AI suggestions for the specified city
    const suggestionsMessages = groupChat.messages.filter(message => 
      message.attachments && 
      message.attachments.some(attachment => 
        attachment.type === "ai-trip-plan" && 
        attachment.data && 
        attachment.data.city && 
        attachment.data.city.toLowerCase() === city.toLowerCase()
      )
    );

    if (suggestionsMessages.length === 0) {
      return res.status(404).json({
        message: `No saved suggestions found for ${city}`
      });
    }

    // Get the most recent suggestion
    const latestSuggestion = suggestionsMessages
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
    
    const suggestionData = latestSuggestion.attachments.find(
      attachment => attachment.type === "ai-trip-plan"
    ).data;

    res.json(suggestionData);
  } catch (error) {
    console.error('Error fetching AI suggestions:', error);
    res.status(500).json({ 
      message: 'Error fetching travel suggestions',
      error: error.message 
    });
  }
});

// AI Cost Estimation Route
router.post('/:chatId/cost-estimate', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { 
      city, 
      category, 
      details,
      numPeople,
      duration,
      quality,
      additionalInfo 
    } = req.body;
    const auth0Id = req.userId;

    // Parameter validation
    if (!city || !category) {
      return res.status(400).json({ 
        message: 'City and category are required'
      });
    }

    // Find the group chat and verify user access
    const groupChat = await GroupChat.findOne({
      chatId,
      "members.auth0Id": auth0Id
    });

    if (!groupChat) {
      return res.status(404).json({ 
        message: "Chat not found or access denied" 
      });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }); // Using free version

    // Create dynamic prompt based on category
    let categorySpecificPrompt = "";
    switch(category) {
      case "accommodation":
        categorySpecificPrompt = `For ${numPeople} people staying in ${city} for ${duration} days/nights with a ${quality} preference. Accommodation type: ${details.type || "various"}. Include price ranges for different neighborhoods.`;
        break;
      case "food":
        categorySpecificPrompt = `For ${numPeople} people in ${city} for ${duration} days with ${details.mealsPerDay || 3} meals per day at ${quality} dining establishments. Include costs for local specialties.`;
        break;
      case "activities":
        categorySpecificPrompt = `For popular activities and attractions in ${city} for ${numPeople} people. Include entrance fees for key attractions, guided tours, and ${details.activityType || "various"} activities.`;
        break;
      case "transportation":
        categorySpecificPrompt = `For getting around ${city} using ${details.transportType || "various"} transportation options for ${numPeople} people for ${duration} days. Include public transit costs, taxi estimates, and rental options.`;
        break;
      case "daily":
        categorySpecificPrompt = `Overall daily living costs in ${city} for ${numPeople} people including average expenses across all categories (food, transport, entertainment, etc.) for ${quality} level travelers.`;
        break;
      default:
        categorySpecificPrompt = `General cost information for ${category} in ${city} for ${numPeople} people.`;
    }

    // Create the complete prompt for the AI
    const prompt = `As a travel cost expert, provide a detailed cost analysis for ${city} regarding ${category} costs.IMPORTANT: ALL costs MUST be provided in Indian Rupees (INR) only. Include the ₹ symbol before each numerical cost value.

${categorySpecificPrompt}

Additional context: ${additionalInfo || "None provided"}

Return ONLY a JSON object with no additional text, markdown, or code block formatting, structured exactly as follows:
{
  "low": {
    "amount": number,
    "currency": "INR",
    "description": "Budget-friendly estimate explanation"
  },
  "medium": {
    "amount": number,
    "currency": "INR",
    "description": "Mid-range estimate explanation"
  },
  "high": {
    "amount": number,
    "currency": "INR",
    "description": "Premium estimate explanation"
  },
  "breakdown": [
    {
      "item": "specific cost item name",
      "lowCost": number,
      "highCost": number,
      "notes": "Extra information about this cost"
    }
  ],
  "tips": [
    "money-saving tip 1",
    "money-saving tip 2"
  ],
  "totalEstimatedCost": number,
  "perPersonPerDay": number
}`;

    // Generate AI response
    const result = await model.generateContent(prompt);
    const response = result.response;
    let responseText = response.text();
    
    // Clean up the response text to ensure valid JSON
    responseText = responseText.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      // Parse JSON response
      const costEstimate = JSON.parse(responseText);
      
      // Find the member to get their name
      const member = groupChat.members.find(m => m.auth0Id === auth0Id);
      
      // Create a new message with the cost estimate as an attachment
      const newMessage = {
        sender: auth0Id,
        senderName: member ? member.name : "Unknown User",
        content: `Generated cost estimate for ${category} in ${city}`,
        timestamp: new Date(),
        attachments: [
          {
            type: "ai-trip-plan", // Reusing existing attachment type
            data: {
              type: "cost-estimate",
              city,
              category,
              details: {
                numPeople,
                duration,
                quality,
                ...details
              },
              estimate: costEstimate
            }
          }
        ]
      };
      
      // Add the message to the chat
      groupChat.messages.push(newMessage);
      await groupChat.save();
      
      res.json({
        city,
        category,
        estimate: costEstimate
      });
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      
      // Try to repair the JSON
      try {
        const repairedJson = jsonrepair(responseText);
        const costEstimate = JSON.parse(repairedJson);
        
        // Find the member to get their name
        const member = groupChat.members.find(m => m.auth0Id === auth0Id);
        
        // Create a new message with the cost estimate as an attachment
        const newMessage = {
          sender: auth0Id,
          senderName: member ? member.name : "Unknown User",
          content: `Generated cost estimate for ${category} in ${city}`,
          timestamp: new Date(),
          attachments: [
            {
              type: "ai-trip-plan", // Reusing existing attachment type
              data: {
                type: "cost-estimate",
                city,
                category,
                details: {
                  numPeople,
                  duration,
                  quality,
                  ...details
                },
                estimate: costEstimate
              }
            }
          ]
        };
        
        // Add the message to the chat
        groupChat.messages.push(newMessage);
        await groupChat.save();
        
        res.json({
          city,
          category,
          estimate: costEstimate
        });
      } catch (repairError) {
        res.status(500).json({ 
          message: 'Error processing AI response',
          error: parseError.message,
          rawResponse: responseText 
        });
      }
    }
  } catch (error) {
    console.error('Error generating cost estimate:', error);
    res.status(500).json({ 
      message: 'Error generating cost estimate',
      error: error.message 
    });
  }
});

// Get saved cost estimates for a chat
router.get('/:chatId/cost-estimates', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { city, category } = req.query;
    const auth0Id = req.userId;

    // Find the group chat and ensure the user is a member
    const groupChat = await GroupChat.findOne({
      chatId,
      "members.auth0Id": auth0Id
    });

    if (!groupChat) {
      return res.status(404).json({ 
        message: "Group chat not found or access denied" 
      });
    }

    // Find messages with cost estimates
    let estimateMessages = groupChat.messages.filter(message => 
      message.attachments && 
      message.attachments.some(attachment => 
        attachment.type === "ai-trip-plan" && 
        attachment.data && 
        attachment.data.type === "cost-estimate"
      )
    );

    // Apply filters if provided
    if (city) {
      estimateMessages = estimateMessages.filter(message =>
        message.attachments.some(att => 
          att.data.city && att.data.city.toLowerCase() === city.toLowerCase()
        )
      );
    }

    if (category) {
      estimateMessages = estimateMessages.filter(message =>
        message.attachments.some(att => 
          att.data.category && att.data.category === category
        )
      );
    }

    if (estimateMessages.length === 0) {
      return res.status(404).json({
        message: `No saved cost estimates found${city ? ` for ${city}` : ''}${category ? ` regarding ${category}` : ''}`
      });
    }

    // Extract cost estimates from messages
    const estimates = estimateMessages.map(message => {
      const attachment = message.attachments.find(
        att => att.data.type === "cost-estimate"
      );
      return {
        id: message._id,
        timestamp: message.timestamp,
        ...attachment.data
      };
    });

    res.json(estimates);
  } catch (error) {
    console.error('Error fetching cost estimates:', error);
    res.status(500).json({ 
      message: 'Error fetching cost estimates',
      error: error.message 
    });
  }
});


module.exports = router;