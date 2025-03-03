import React, { useState } from "react";
import { Link } from "react-router-dom";
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
} from "recharts";
import TripFlowGraph from "./TripFlowGraph";

const TripDetails = ({ trip, onClose, onAddMember }) => {
  const [showTripGraph, setShowTripGraph] = useState(false);

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

  // Ensure that trip.memberDetails is always an array and each member has the required properties
  const safeMembers = Array.isArray(trip.memberDetails)
    ? trip.memberDetails.map((member) => {
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
  const safeExpenses = Array.isArray(trip.expenses)
    ? trip.expenses.map((expense) => {
        if (typeof expense === "object" && expense !== null) {
          return {
            category:
              typeof expense.category === "string"
                ? expense.category
                : "Miscellaneous",
            amount: typeof expense.amount === "number" ? expense.amount : 0,
          };
        }
        return { category: "Miscellaneous", amount: 0 };
      })
    : [];

  // Create a safe trip object with all necessary properties
  const safeTrip = {
    ...trip,
    name: trip.name || "Unnamed Trip",
    summary: trip.summary || "",
    mainDestination: trip.mainDestination || "No destination set",
    sideDestinations: safeSideDestinations,
    expenses: safeExpenses,
    budget: typeof trip.budget === "number" ? trip.budget : 0,
    currentSpent: typeof trip.currentSpent === "number" ? trip.currentSpent : 0,
    dates: {
      start: trip.dates?.start || null,
      end: trip.dates?.end || null,
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
              </h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={safeExpenses}>
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
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
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
              <div className="mt-6 grid grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <span className="text-gray-600 text-lg">Total Budget</span>
                  <p className="text-3xl font-semibold text-gray-800 mt-2">
                    ${safeTrip.budget.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <span className="text-gray-600 text-lg">Spent</span>
                  <p className="text-3xl font-semibold text-purple-600 mt-2">
                    ${safeTrip.currentSpent.toLocaleString()}
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
            <Link to="/chat/chatname">
              <button className="w-full bg-purple-600 text-white rounded-xl py-4 px-6 flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors text-lg font-medium shadow-sm">
                <MessageCircle className="w-6 h-6" />
                Start Group Chat
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
