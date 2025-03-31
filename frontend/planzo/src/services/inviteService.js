import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

export const useInvitationService = () => {
  const { getAccessTokenSilently } = useAuth0();

  // Generate invitation link for a trip
  const generateInviteLink = async (tripId) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "create:invitations",
        },
      });

      const response = await axios.post(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/trips/${tripId}/invite`,
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
      console.error("Error generating invite link:", error);
      throw error;
    }
  };

  // Accept an invitation
  const acceptInvitation = async (inviteCode) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "update:trips",
        },
      });

      const response = await axios.post(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/trips/invite/${inviteCode}/accept`,
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
      console.error("Error accepting invitation:", error);
      throw error;
    }
  };

  return {
    generateInviteLink,
    acceptInvitation,
  };
};
