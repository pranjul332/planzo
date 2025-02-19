import React from "react";
import {
  X,
  MapPin,
  Users,
  Calendar,
  MessageCircle,
  DollarSign,
  Map,
  Plus,
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
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{trip.name}</h1>
            <p className="text-gray-600 mt-1">{trip.summary}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Destinations */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Map className="w-5 h-5" />
                Destinations
              </h2>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 text-purple-600 font-medium">
                    <MapPin className="w-5 h-5" />
                    Main: {trip.mainDestination}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {trip.sideDestinations.map((dest, index) => (
                    <div
                      key={index}
                      className="bg-white p-3 rounded-lg border border-gray-100"
                    >
                      <span className="text-gray-600">{dest}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Budget Overview */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Budget Overview
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trip.expenses}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#8b5cf6" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <span className="text-gray-600">Total Budget</span>
                  <p className="text-2xl font-semibold text-gray-800">
                    ${trip.budget}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <span className="text-gray-600">Spent</span>
                  <p className="text-2xl font-semibold text-purple-600">
                    ${trip.currentSpent}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Trip Details */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Trip Details</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span>
                    {new Date(trip.dates.start).toLocaleDateString()} -{" "}
                    {new Date(trip.dates.end).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span>{trip.members} members</span>
                </div>
              </div>
            </div>

            {/* Members */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Members
                </h2>
                <button
                  onClick={onAddMember}
                  className="text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Member
                </button>
              </div>
              <div className="space-y-3">
                {trip.memberDetails.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100"
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-medium">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Button */}
            <button className="w-full bg-purple-600 text-white rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors">
              <MessageCircle className="w-5 h-5" />
              Start Group Chat
            </button>
          </div>
        </div>
      </div>

      {/* Trip Flow Graph */}
      <TripFlowGraph trip={trip} />
    </div>
  );
};

export default TripDetails;
