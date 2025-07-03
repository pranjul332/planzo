import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInvitationService } from "../../../services/inviteService";
import { useAuth0 } from "@auth0/auth0-react";

const InviteAccept = () => {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const { acceptInvitation, getInvitationDetails } = useInvitationService();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accepted, setAccepted] = useState(false);
  const [tripDetails, setTripDetails] = useState(null);

  useEffect(() => {
    // First, try to get invitation details (this doesn't require authentication)
    if (inviteCode) {
      fetchInvitationDetails();
    }
  }, [inviteCode]);

  useEffect(() => {
    // If user is authenticated, process the invitation
    if (isAuthenticated && inviteCode && tripDetails) {
      handleAcceptInvitation();
    } else if (!isAuthenticated && inviteCode && tripDetails) {
      // If not authenticated, store the invite code and redirect to login
      sessionStorage.setItem("pendingInviteCode", inviteCode);
      loginWithRedirect({
        appState: { returnTo: `/invite/${inviteCode}` },
      });
    }
  }, [isAuthenticated, inviteCode, tripDetails]);

  const fetchInvitationDetails = async () => {
    try {
      const details = await getInvitationDetails(inviteCode);
      setTripDetails(details);
    } catch (error) {
      console.error("Error fetching invitation details:", error);
      setError("Invalid or expired invitation link");
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    try {
      setLoading(true);
      const result = await acceptInvitation(inviteCode);
      setAccepted(true);

      // After successful acceptance, navigate to the trip
      setTimeout(() => {
        navigate(`/trip/ManageTrip/${result.tripId || tripDetails.tripId}`);
      }, 2000);
    } catch (error) {
      console.error("Error accepting invitation:", error);
      setError(error.response?.data?.message || "Failed to accept invitation");
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
          <p className="mt-4 text-lg text-gray-600">
            {tripDetails
              ? "Processing invitation..."
              : "Loading invitation details..."}
          </p>
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
            onClick={() => navigate("/")}
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
            You have been added to the trip "{tripDetails?.tripName}"!
            Redirecting you to the trip page...
          </p>
        </div>
      </div>
    );
  }

  // Show invitation details before accepting (for unauthenticated users)
  if (!isAuthenticated && tripDetails) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md">
          <div className="text-blue-500 text-5xl mb-4">✈️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Trip Invitation
          </h1>
          <p className="text-gray-600 mb-6">
            You've been invited to join "{tripDetails.tripName}". Please log in
            to accept this invitation.
          </p>
          <button
            onClick={() =>
              loginWithRedirect({
                appState: { returnTo: `/invite/${inviteCode}` },
              })
            }
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Log In to Accept
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default InviteAccept;
