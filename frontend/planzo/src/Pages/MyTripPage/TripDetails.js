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
} from "lucide-react";
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

  const { createGroupChat, getGroupChatByTripId, getTripCosts } =
    useGroupChatService();

  const budget = trip.budget || trip.totalBudget || 0;

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

  // Handler for starting a group chat
  const handleStartGroupChat = async () => {
    try {
      setIsLoading(true);

      // Try to find an existing chat for this trip first
      try {
        const existingChat = await getGroupChatByTripId(
          trip.tripId || trip.id || trip._id
        );

        // If we found an existing chat, navigate to it
        if (existingChat && existingChat.chatId) {
          navigate(`/chat/${existingChat.chatId}`);
          return;
        }
      } catch (error) {
        // If error is 404, that means no chat exists yet, which is fine
        // For other errors, we'll just proceed to create a new chat
        console.log("No existing chat found, creating a new one");
      }

      // Create a new group chat for this trip if none exists
      const newChat = await createGroupChat(trip.tripId || trip.id || trip._id);

      // Navigate to the chat screen
      navigate(`/chat/${newChat.chatId}`);
    } catch (error) {
      console.error("Failed to create/access group chat:", error);
      alert("Failed to create or access group chat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Ensure that trip.memberDetails is always an array and each member has the required properties
  const safeMembers = Array.isArray(trip.memberDetails || trip.members)
    ? (trip.memberDetails || trip.members).map((member) => {
        if (typeof member === "object" && member !== null) {
          return {
            id:
              member.id ||
              member._id ||
              `member-${Math.random().toString(36).substr(2, 9)}`,
            name:
              typeof member.name === "string" ? member.name : "Unknown Member",
            role: typeof member.role === "string" ? member.role : "Member",
          };
        }
        return {
          id: `member-${Math.random().toString(36).substr(2, 9)}`,
          name: "Unknown Member",
          role: "Member",
        };
      })
    : [];

  // Ensure side destinations is always an array of strings
  const safeSideDestinations = Array.isArray(trip.sideDestinations)
    ? trip.sideDestinations.map((dest) =>
        typeof dest === "string" ? dest : JSON.stringify(dest)
      )
    : [];

  // Ensure expenses is always an array with valid structure for the chart
  const safeExpenses = [
    { category: "travel", amount: 0 },
    { category: "stay", amount: 0 },
    { category: "food", amount: 0 },
    { category: "activities", amount: 0 },
  ];
  useEffect(() => {
    const fetchTripCosts = async () => {
      try {
        setIsLoading(true);
        // First, try to get the group chat for this trip
        const chatResponse = await getGroupChatByTripId(
          trip.tripId || trip.id || trip._id
        );

        if (chatResponse && chatResponse.chatId) {
          // If chat exists, fetch its trip costs
          const costsData = await getTripCosts(chatResponse.chatId);

          if (costsData && costsData.categories) {
            // Update trip costs and total cost
            setTripCosts(costsData.categories);
            setTotalCost(costsData.totalCost || 0);
          }
        }
      } catch (error) {
        console.error("Error fetching trip costs:", error);
        // Optionally show an error message to the user
      } finally {
        setIsLoading(false);
      }
    };

    fetchTripCosts();
  }, [trip]);

  // Determine the color and text for spent amount based on budget
  const getSpentAmountClass = () => {
    if (totalCost > budget) {
      return "text-3xl font-semibold text-red-600 mt-2";
    }
    return "text-3xl font-semibold text-purple-600 mt-2";
  };

  // If trip has expenses, map them to the correct categories
  if (
    Array.isArray(trip.expenses) ||
    Array.isArray(trip.tripCosts?.categories)
  ) {
    const expenseData = trip.expenses || trip.tripCosts?.categories;
    expenseData.forEach((expense) => {
      const matchingCategory = safeExpenses.find(
        (safe) => safe.category === expense.category
      );
      if (matchingCategory) {
        matchingCategory.amount = expense.amount || 0;
      }
    });
  }

  // Create a safe trip object with all necessary properties
  const safeTrip = {
    ...trip,
    name: trip.name || "Unnamed Trip",
    summary: trip.summary || trip.description || "",
    mainDestination: trip.mainDestination || "No destination set",
    sideDestinations: safeSideDestinations,
    expenses: safeExpenses,
    budget: typeof trip.budget === "number" ? trip.budget : 0,
    currentSpent: typeof trip.currentSpent === "number" ? trip.currentSpent : 0,
    dates: {
      start: trip.dates?.start || trip.startDate || null,
      end: trip.dates?.end || trip.endDate || null,
    },
    members:
      typeof trip.members === "number" ? trip.members : safeMembers.length,
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
                {safeTrip.name}
              </h1>
              <p className="text-gray-600 mt-2 text-lg">{safeTrip.summary}</p>
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
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Map className="w-6 h-6 text-purple-600" />
                Destinations
              </h2>
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 text-purple-600 font-medium text-lg">
                    <MapPin className="w-6 h-6" />
                    Main: {safeTrip.mainDestination}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {safeSideDestinations.map((dest, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <span className="text-gray-700">{dest}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Budget Overview */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-purple-600" />
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
                      formatter={(value, name) => [`$${value}`, name]}
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
                      ${expense.amount.toLocaleString()}
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
                    ${budget.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <span className="text-gray-600 text-lg">Spent</span>
                  <p className={getSpentAmountClass()}>
                    ${totalCost.toLocaleString()}
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
                    {formatDate(safeTrip.dates.start)} -{" "}
                    {formatDate(safeTrip.dates.end)}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100">
                  <Users className="w-6 h-6 text-purple-600" />
                  <span className="text-gray-700">
                    {safeTrip.members} members
                  </span>
                </div>
              </div>
            </div>

            {/* Members */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Users className="w-6 h-6 text-purple-600" />
                  Members
                </h2>
                <button
                  onClick={onAddMember}
                  className="text-purple-600 hover:text-purple-700 flex items-center gap-2 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add Member
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
    </div>
  );
};

export default TripDetails;
