import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  MapPin,
  Users,
  Calendar,
  MessageCircle,
  DollarSign,
  Map,
  Plus,
  ChevronDown,
  ChevronUp,
  GitBranch,
  IndianRupee,
  Copy,
  Share2,
  Mail,
  MessageSquare,
  CheckCircle,
  Clock,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import TripFlowGraph from "./TripFlowGraph";
import { useGroupChatService } from "../../services/chatService";
import { useTripService } from "../../services/tripService";
import { useInvitationService } from "../../services/inviteService";

const TripDetails = ({ trip, onClose, onAddMember }) => {
  const [tripCosts, setTripCosts] = useState([
    { category: "travel", amount: 0, percentage: 0 },
    { category: "stay", amount: 0, percentage: 0 },
    { category: "food", amount: 0, percentage: 0 },
    { category: "activities", amount: 0, percentage: 0 },
  ]);
  const [totalCost, setTotalCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showTripGraph, setShowTripGraph] = useState(false);
  const [tripId, setTripId] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [tripData, setTripData] = useState(null);
  const [groupChatData, setGroupChatData] = useState(null);

  const [inviteLink, setInviteLink] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("link");
  const { generateInviteLink } = useInvitationService();

  const {
    createGroupChat,
    getGroupChatByTripId,
    getTripCosts,
    getGroupChatById,
  } = useGroupChatService();
  const { getTripById } = useTripService();

  const budget = trip?.budget || trip?.totalBudget || 0;

  // Format date with fallback for missing or invalid dates
  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "TBD";
    }
  };

  useEffect(() => {
    const fetchTripCosts = async () => {
      try {
        setIsLoading(true);
        const chatResponse = await getGroupChatByTripId(
          trip?.tripId || trip?.id || trip?._id
        );

        if (chatResponse && chatResponse.chatId) {
          setTripId(chatResponse.tripId);
          setChatId(chatResponse.chatId);
          const fullChatDetails = await getGroupChatById(chatResponse.chatId);
          setGroupChatData(fullChatDetails);

          const costsData = await getTripCosts(chatResponse.chatId);
          if (costsData && costsData.categories) {
            setTripCosts(costsData.categories);
            setTotalCost(costsData.totalCost || 0);
          }
        }
      } catch (error) {
        console.error("Error fetching trip costs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTripCosts();
  }, [trip]);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setIsLoading(true);
        const data = await getTripById(tripId);

        setTripData(data);
      } catch (error) {
        console.error("Error fetching trip details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (tripId) {
      fetchTripData();
    }
  }, [tripId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading trip details...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Trip not found</p>
      </div>
    );
  }

  const handleStartGroupChat = async () => {
    try {
      setIsLoading(true);
      try {
        const existingChat = await getGroupChatByTripId(
          trip?.tripId || trip?.id || trip?._id
        );
        if (existingChat && existingChat.chatId) {
          navigate(`/chat/${existingChat.chatId}`);
          return;
        }
      } catch (error) {
        console.log("No existing chat found, creating a new one");
      }

      const newChat = await createGroupChat(
        trip?.tripId || trip?.id || trip?._id
      );
      navigate(`/chat/${newChat.chatId}`);
    } catch (error) {
      console.error("Failed to create/access group chat:", error);
      alert("Failed to create or access group chat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare members from group chat schema
  const safeMembers = groupChatData?.members
    ? groupChatData.members.map((member) => ({
        id: member.auth0Id,
        name: member.name,
        role: member.role || "Member",
      }))
    : [];

  // Prepare destinations from group chat schema
  const chatDestinations = groupChatData?.destinations
    ? groupChatData.destinations.map((dest) => `${dest.name} `)
    : [];
  // Combine destinations from trip and chat
  const safeSideDestinations = [
    ...(trip?.sideDestinations || []),
    ...chatDestinations,
  ];

  const safeExpenses = [
    { category: "travel", amount: 0 },
    { category: "stay", amount: 0 },
    { category: "food", amount: 0 },
    { category: "activities", amount: 0 },
  ];

  const getSpentAmountClass = () => {
    if (totalCost > budget) {
      return "text-3xl font-semibold text-red-600 mt-2";
    }
    return "text-3xl font-semibold text-purple-600 mt-2";
  };

  if (
    Array.isArray(trip?.expenses) ||
    Array.isArray(trip?.tripCosts?.categories)
  ) {
    const expenseData = trip?.expenses || trip?.tripCosts?.categories || "0";
    expenseData.forEach((expense) => {
      const matchingCategory = safeExpenses.find(
        (safe) => safe.category === expense.category
      );
      if (matchingCategory) {
        matchingCategory.amount = expense.amount || 0;
      }
    });
  }
  // New function to handle inviting a member
  const handleInviteMember = async () => {
    try {
      setIsGeneratingLink(true);
      const { inviteLink } = await generateInviteLink(
        trip?.tripId || trip?.id || trip?._id
      );
      setInviteLink(inviteLink);
      setShowInviteModal(true);
    } catch (error) {
      console.error("Failed to generate invite link:", error);
      toast.error("Failed to generate invite link. Please try again.");
    } finally {
      setIsGeneratingLink(false);
    }
  };
  // Function to copy invite link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Join my trip on TripPlanner`);
    const body = encodeURIComponent(
      `Hey! I'd like to invite you to join my trip. Click the link to join: ${inviteLink}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  // Function to share via WhatsApp
  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Hey! I'd like to invite you to join my trip on TripPlanner. Click the link to join: ${inviteLink}`
    );
    window.open(`https://wa.me/?text=${text}`);
  };

  // Function to share using Web Share API if available
  const handleWebShare = () => {
    try {
      // Ensure the link is a valid URL with protocol
      let shareUrl = inviteLink;

      // Add https:// protocol if missing
      if (inviteLink && !inviteLink.match(/^https?:\/\//)) {
        shareUrl = `https://${inviteLink}`;
      }

      // Validate URL format
      try {
        new URL(shareUrl);
      } catch (e) {
        console.error("Invalid URL format:", shareUrl);
        // Fall back to copy if URL is invalid
        handleCopyLink();
        return;
      }

      if (navigator.share) {
        navigator
          .share({
            title: "Join my trip on TripPlanner",
            text: "Hey! I'd like to invite you to join my trip.",
            url: shareUrl,
          })
          .catch((error) => {
            console.log("Error sharing:", error);
            // Fall back to copy on share error
            handleCopyLink();
          });
      } else {
        // Fall back to copy if Web Share API not available
        handleCopyLink();
      }
    } catch (error) {
      console.error("Share error:", error);
      // Ultimate fallback
      handleCopyLink();
    }
  };

  // Modal backdrop with blur effect
  const ModalBackdrop = ({ children }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      {children}
    </div>
  );

  // Add this in your JSX for the invite modal
  const InviteModal = () => (
    <ModalBackdrop>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scaleIn">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-purple-800">Invite to Trip</h2>
          <button
            onClick={() => setShowInviteModal(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors rounded-full p-1 hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs for different sharing methods */}
        <div className="mb-5 border-b">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("link")}
              className={`py-2 px-4 text-sm font-medium transition-colors ${
                activeTab === "link"
                  ? "text-purple-700 border-b-2 border-purple-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Link
              </div>
            </button>

           

            <button
              onClick={() => setActiveTab("share")}
              className={`py-2 px-4 text-sm font-medium transition-colors ${
                activeTab === "share"
                  ? "text-purple-700 border-b-2 border-purple-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </div>
            </button>
          </div>
        </div>

        {/* Tab content */}
        <div className="mb-6">
          {activeTab === "link" && (
            <div className="space-y-4 animate-fadeIn">
              <p className="text-gray-600 mb-2 font-medium">
                Share this link with friends to invite them:
              </p>
              <div className="flex items-center">
                <input
                  type="text"
                  className="flex-1 p-3 border border-gray-300 rounded-l-lg text-sm bg-gray-50 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                  value={inviteLink}
                  readOnly
                />
                <button
                  onClick={handleCopyLink}
                  className={`${
                    copySuccess
                      ? "bg-green-600"
                      : "bg-purple-600 hover:bg-purple-700"
                  } text-white px-4 py-3 rounded-r-lg transition-colors flex items-center gap-1 font-medium`}
                  aria-label="Copy invite link"
                >
                  {copySuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === "share" && (
            <div className="animate-fadeIn">
              <p className="text-gray-600 mb-4 font-medium">Share via:</p>
              <div className="grid grid-cols-3 gap-3">
                <ShareButton
                  onClick={handleWebShare}
                  icon={<Share2 className="w-6 h-6 text-purple-600 mb-2" />}
                  label="Share"
                />

                <ShareButton
                  onClick={handleEmailShare}
                  icon={<Mail className="w-6 h-6 text-purple-600 mb-2" />}
                  label="Email"
                />

                <ShareButton
                  onClick={handleWhatsAppShare}
                  icon={
                    <MessageSquare className="w-6 h-6 text-purple-600 mb-2" />
                  }
                  label="WhatsApp"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-center py-3 bg-purple-50 rounded-lg">
          <Clock className="w-4 h-4 text-purple-600 mr-2" />
          <div className="text-purple-700 text-sm font-medium">
            This invite link will expire in 7 days
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );

  // Share button component
  const ShareButton = ({ onClick, icon, label }) => (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center bg-gray-50 hover:bg-purple-50 border border-gray-200 transition-colors p-4 rounded-xl hover:shadow-md"
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  const safeTrip = {
    ...trip,
    name: trip?.name || "Unnamed Trip",
    summary: trip?.summary || trip?.description || "",
    mainDestination: trip?.mainDestination || "No destination set",
    sideDestinations: safeSideDestinations,
    expenses: safeExpenses,
    budget: typeof trip?.budget === "number" ? trip.budget : 0,
    currentSpent:
      typeof trip?.currentSpent === "number" ? trip.currentSpent : 0,
    dates: {
      start: trip?.dates?.start || trip?.startDate || null,
      end: trip?.dates?.end || trip?.endDate || null,
    },
    members:
      typeof trip?.members === "number" ? trip.members : safeMembers.length,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col space-y-4">
          {/* Top Row */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {tripData?.name || trip?.name || "Unnamed Trip"}
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                {tripData?.description || trip?.description || ""}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Trip Graph Toggle */}
          <div className="border-t pt-4">
            <button
              onClick={() => setShowTripGraph(!showTripGraph)}
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              <GitBranch className="w-5 h-5" />
              {showTripGraph ? "Hide Trip Flow" : "Show Trip Flow"}
              {showTripGraph ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Trip Flow Graph */}
          {showTripGraph && (
            <div className="mt-4 bg-gray-50 rounded-xl p-6">
              <TripFlowGraph trip={safeTrip} />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Destinations */}
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-lg p-6 border border-purple-100/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <Map className="w-7 h-7 text-purple-600 stroke-[2.5]" />
                  <span>Trip Destinations</span>
                </h2>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  {safeSideDestinations.length + 1} Destinations
                </div>
              </div>

              <div className="space-y-6">
                {/* Main Destination Card */}
                <div className="bg-white rounded-2xl border border-purple-100 shadow-md overflow-hidden transition-all hover:shadow-xl">
                  <div className="p-5 flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <MapPin className="w-7 h-7 text-purple-600 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">
                        Main Destination :
                      </h3>
                      <p className="text-lg text-purple-600 font-medium">
                        {" "}
                        {tripData?.mainDestination ||
                          tripData?.mainDestination ||
                          trip?.mainDestination ||
                          "No destination set"}
                      </p>
                      {groupChatData?.destinations?.[0]?.country && (
                        <p className="text-sm text-gray-500 mt-1"></p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Side Destinations Grid */}
                {safeSideDestinations.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Side Destinations
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {safeSideDestinations.map((dest, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
                        >
                          <div className="p-4 flex items-center gap-3">
                            <div className="bg-purple-50 p-2 rounded-full">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-purple-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </div>
                            <span className="text-gray-800 font-medium text-base">
                              {dest}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Budget Overview */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <IndianRupee className="w-6 h-6 text-purple-600" />
                Budget Overview
                {isLoading && (
                  <span className="ml-2 text-sm text-gray-500">
                    Loading costs...
                  </span>
                )}
              </h2>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={tripCosts}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="category" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        padding: "8px",
                      }}
                      formatter={(value, name) => [`₹${value}`, name]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      name="Expenses"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{
                        fill: "#8b5cf6",
                        stroke: "#8b5cf6",
                        strokeWidth: 2,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 grid grid-cols-4 gap-4">
                {tripCosts.map((expense) => (
                  <div
                    key={expense.category}
                    className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center"
                  >
                    <span className="text-gray-600 capitalize">
                      {expense.category}
                    </span>
                    <p className="text-2xl font-semibold text-purple-600 mt-2">
                      ₹{expense.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {expense.percentage}%
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <span className="text-gray-600 text-lg">Total Budget</span>
                  <p className="text-3xl font-semibold text-gray-800 mt-2">
                    ₹{budget.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <span className="text-gray-600 text-lg">Spent</span>
                  <p className={getSpentAmountClass()}>
                    ₹{totalCost.toLocaleString()}
                    {totalCost > budget && (
                      <span className="ml-2 text-sm text-red-500">
                        (Over Budget)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Trip Details */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6">Trip Details</h2>
              <div className="space-y-5">
                <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100">
                  <Calendar className="w-6 h-6 text-purple-600" />
                  <span className="text-gray-700">
                    {formatDate(tripData?.startDate || trip?.startDate)} -{" "}
                    {formatDate(tripData?.endDate || trip?.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100">
                  <Users className="w-6 h-6 text-purple-600" />
                  <span className="text-gray-700">
                    {safeMembers.length} members
                  </span>
                </div>
              </div>
            </div>

            {/* Members */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Users className="w-6 h-6 text-purple-600" />
                  <span className="text-gray-800">Members</span>
                </h2>
                <button
                  onClick={handleInviteMember}
                  disabled={isGeneratingLink}
                  className={`
            px-4 py-2 rounded-lg font-medium 
            ${
              isGeneratingLink
                ? "bg-purple-100 text-purple-400"
                : "bg-purple-600 text-white hover:bg-purple-700 shadow-sm"
            } 
            transition-all flex items-center gap-2
          `}
                >
                  <Plus className="w-5 h-5" />
                  {isGeneratingLink ? "Generating..." : "Invite Member"}
                </button>
              </div>
              <div className="space-y-4">
                {safeMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold text-lg">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Button */}
            <button
              onClick={handleStartGroupChat}
              disabled={isLoading}
              className="w-full bg-purple-600 text-white rounded-xl py-4 px-6 flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors text-lg font-medium shadow-sm disabled:opacity-70"
            >
              {isLoading ? (
                "Creating chat..."
              ) : (
                <>
                  <MessageCircle className="w-6 h-6" />
                  Start Group Chat
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      {showInviteModal && <InviteModal />}
    </div>
  );
};

export default TripDetails;
