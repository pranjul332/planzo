import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

export const useTripService = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createTrip = async (tripData) => {
    try {
      // Get access token with the correct audience and scope
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "create:trips",
        },
      });

      console.log("Token obtained for API call");

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/trips`,
        tripData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
      
    } catch (error) {
        
      console.error("Error creating trip:", error);
      // More detailed error handling
      if (error.response) {
        
        // The request was made and the server responded with a status code
        console.error("Response error:", error.response.data);
        throw new Error(error.response.data.message || "Failed to create trip");
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request error:", error.request);
        throw new Error("No response from server. Check your connection.");
      } else {
        // Something happened in setting up the request
        throw error;
      }
    }
  };

  // Other methods with the same pattern
  const getTrips = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "read:trips",
        },
      });

      const response = await fetch("http://localhost:5000/api/trips", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Full error response:", errorText);

        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || "Failed to fetch trips");
        } catch (e) {
          throw new Error(`Status ${response.status}: ${errorText}`);
        }
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching trips:", error);
      throw error;
    }
  };

  const getTripById = async (tripId) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "read:trips",
        },
      });

      // Fix: Add slash before tripId
      const response = await fetch(
        `http://localhost:5000/api/trips/${tripId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Full error response:", errorText);

        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || "Failed to fetch trip");
        } catch (e) {
          throw new Error(`Status ${response.status}: ${errorText}`);
        }
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching trip:", error);
      throw error;
    }
  };

  return {
    createTrip,
    getTrips,
    getTripById,
  };
};
