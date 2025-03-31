import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInvitationService } from "../../../services/inviteService";
import { useAuth0 } from "@auth0/auth0-react";

const InviteAccept = () => {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const { acceptInvitation } = useInvitationService();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    // If user is authenticated, process the invitation
    if (isAuthenticated && inviteCode) {
      handleAcceptInvitation();
    } else if (!isAuthenticated && inviteCode) {
      // If not authenticated, store the invite code and redirect to login
      sessionStorage.setItem("pendingInviteCode", inviteCode);
      loginWithRedirect({
        appState: { returnTo: `trip/ManageTrip` },
      });
    }
  }, [isAuthenticated, inviteCode]);

  const handleAcceptInvitation = async () => {
    try {
      setLoading(true);
      const result = await acceptInvitation(inviteCode);
      setAccepted(true);

      // After successful acceptance, navigate to the trip
      setTimeout(() => {
        navigate(`trip/ManageTrip`);
      }, 2000);
    } catch (error) {
      console.error("Error accepting invitation:", error);
      setError(error.message || "Failed to accept invitation");
    } finally {
      setLoading(false);
    }
  };

  // Check for pending invitations after login
  useEffect(() => {
    if (isAuthenticated) {
      const pendingInvite = sessionStorage.getItem("pendingInviteCode");
      if (pendingInvite) {
        sessionStorage.removeItem("pendingInviteCode");
        // If we're not already on the invite page, navigate there
        if (!inviteCode) {
          navigate(`/invite/${pendingInvite}`);
        }
      }
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Processing invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Invitation Error
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            // onClick={() => navigate("/")}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Successfully Joined Trip
          </h1>
          <p className="text-gray-600 mb-6">
            You have been added to the trip! Redirecting you to the trip page...
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default InviteAccept;
