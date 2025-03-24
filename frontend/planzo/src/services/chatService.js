import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

export const useGroupChatService = () => {
  const { getAccessTokenSilently } = useAuth0();

  // Create a new group chat for a trip
  const createGroupChat = async (tripId) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "create:chats",
        },
      });

      const response = await axios.post(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/chats/${tripId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error creating group chat:", error);

      if (error.response) {
        throw new Error(
          error.response.data.message || "Failed to create group chat"
        );
      } else if (error.request) {
        throw new Error("No response from server. Check your connection.");
      } else {
        throw error;
      }
    }
  };

  // Get all group chats for current user
  const getGroupChats = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "read:chats",
        },
      });

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/chats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching group chats:", error);
      throw error;
    }
  };

  // Get a specific group chat by chatId
  const getGroupChatById = async (chatId) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "read:chats",
        },
      });

      const response = await axios.get(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/chats/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching group chat:", error);
      throw error;
    }
  };

  // Find group chat by tripId
  const getGroupChatByTripId = async (tripId) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "read:chats",
        },
      });

      const response = await axios.get(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/chats/trip/${tripId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching group chat by trip ID:", error);
      throw error;
    }
  };

  // Send a message to a group chat
  const sendMessage = async (chatId, content, attachments = []) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "write:chats",
        },
      });

      const response = await axios.post(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/chats/${chatId}/messages`,
        { content, attachments },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  // Update group chat settings
  const updateGroupChat = async (chatId, updateData) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "update:chats",
        },
      });

      const response = await axios.put(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/chats/${chatId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating group chat:", error);
      throw error;
    }
  };

  // Add these methods to your existing useGroupChatService hook
  const addDestinations = async (chatId, destinations) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "write:chats",
        },
      });

      const response = await axios.post(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/chats/${chatId}/destinations`,
        { destinations },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error adding destinations:", error);
      throw error;
    }
  };

  const getDestinations = async (chatId) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "read:chats",
        },
      });

      const response = await axios.get(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/chats/${chatId}/destinations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching destinations:", error);
      throw error;
    }
  };

  // Save trip costs for a group chat
  const saveTripCosts = async (chatId, costs) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "write:chats",
        },
      });

      const response = await axios.post(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/chats/${chatId}/trip-costs`,
        { costs },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error saving trip costs:", error);
      throw error;
    }
  };

  // Get trip costs for a group chat
  const getTripCosts = async (chatId) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "read:chats",
        },
      });

      const response = await axios.get(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/chats/${chatId}/trip-costs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching trip costs:", error);
      throw error;
    }
  };

  // Add a new note to a group chat
  const addNote = async (chatId, noteData) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "write:chats",
        },
      });

      const response = await axios.post(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/chats/${chatId}/notes`,
        noteData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error adding note:", error);
      throw error;
    }
  };

  // Get all notes for a group chat
  const getNotes = async (chatId) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "read:chats",
        },
      });

      const response = await axios.get(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/chats/${chatId}/notes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching notes:", error);
      throw error;
    }
  };

  // Update a specific note
  const updateNote = async (chatId, noteId, updateData) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "write:chats",
        },
      });

      const response = await axios.put(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/chats/${chatId}/notes/${noteId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  };

  // Delete a specific note
  const deleteNote = async (chatId, noteId) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "write:chats",
        },
      });

      await axios.delete(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/chats/${chatId}/notes/${noteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    }
  };

  return {
    createGroupChat,
    getGroupChats,
    getGroupChatById,
    getGroupChatByTripId,
    sendMessage,
    updateGroupChat,
    addDestinations,
    getDestinations,
    saveTripCosts,
    getTripCosts,
    addNote,
    getNotes,
    updateNote,
    deleteNote,
  };
};
