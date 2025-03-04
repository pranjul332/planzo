import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

export const useTripService = () => {
  const { getAccessTokenSilently } = useAuth0();

  // Cache to track pending requests
  const pendingRequests = new Map();

  const createTrip = async (tripData) => {
    // Create a unique key based on the operation and data
    const requestKey = `create_trip_${JSON.stringify(tripData)}`;

    // Check if this exact request is already in progress
    if (pendingRequests.has(requestKey)) {
      console.log("Duplicate request detected, returning existing promise");
      return pendingRequests.get(requestKey);
    }

    // Create the promise for this request
    const requestPromise = (async () => {
      try {
        console.log("Creating trip with request ID:", tripData.requestId);

        // Get access token with the correct audience and scope
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: "create:trips",
          },
        });

        const response = await axios.post(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:5000/api"
          }/trips`,
          {
            ...tripData,
            requestId: `req_${Date.now()}_${Math.random()
              .toString(36)
              .substr(2, 9)}`,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        return response.data;
      } catch (error) {
        console.error("Error creating trip:", error);

        if (error.response) {
          // The request was made and the server responded with a status code
          console.error("Response error:", error.response.data);
          throw new Error(
            error.response.data.message || "Failed to create trip"
          );
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Request error:", error.request);
          throw new Error("No response from server. Check your connection.");
        } else {
          // Something happened in setting up the request
          throw error;
        }
      } finally {
        // Remove this request from the pending map when done
        pendingRequests.delete(requestKey);
      }
    })();

    // Store the promise in our pending requests map
    pendingRequests.set(requestKey, requestPromise);

    // Return the promise
    return requestPromise;
  };

  // Other methods remain the same, just ensure you're using the returned 'id'
  const getTrips = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "read:trips",
        },
      });

      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/trips`,
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

      const response = await fetch(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/trips/${tripId}`,
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
