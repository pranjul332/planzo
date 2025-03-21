import React, { useState } from "react";
import { PlusCircle } from "lucide-react";

const TripGraph = ({ tripData = {} }) => {
  // Default trip data if none is provided
  const defaultTrip = {
    mainDestination: "Paris",
    sideDestinations: ["Rome", "Barcelona", "Amsterdam"],
    dates: {
      start: new Date().toISOString(),
      end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
  };

  const [trip, setTrip] = useState(tripData.trip || defaultTrip);
  const [showImport, setShowImport] = useState(false);

  // Format date with fallback
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "TBD";
    }
  };

  const handleImportGraph = () => {
    // Simulate importing a graph
    setShowImport(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg text-gray-800">Trip Timeline</h3>
        <button
          onClick={() => setShowImport(!showImport)}
          className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Import Graph</span>
        </button>
      </div>

      {showImport ? (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in">
          <h4 className="font-medium text-blue-800 mb-2">Import Trip Graph</h4>
          <p className="text-sm text-gray-600 mb-4">
            Select a trip to import its journey visualization:
          </p>

          <div className="space-y-2 mb-4">
            {[
              "European Vacation 2024",
              "Asian Adventure",
              "Weekend Getaway",
            ].map((tripName) => (
              <div
                key={tripName}
                className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <p className="font-medium">{tripName}</p>
                <p className="text-xs text-gray-500">
                  Created on {new Date().toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowImport(false)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleImportGraph}
              className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Import Selected
            </button>
          </div>
        </div>
      ) : (
        <div className="h-96 bg-gray-50 rounded-lg border p-4 relative overflow-hidden">
          <svg viewBox="0 0 400 600" className="w-full h-full">
            {/* Gradient Definitions */}
            <defs>
              <linearGradient
                id="flowingGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.6" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Main Connection Path */}
            <path
              d="M200,50 C200,150 220,200 180,250 C160,300 240,350 200,400 C180,450 220,500 200,550"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Destination Points */}
            <g>
              {/* Start Point */}
              <circle
                cx="200"
                cy="50"
                r="12"
                fill="#EFF6FF"
                stroke="#3B82F6"
                strokeWidth="2"
              >
                <animate
                  attributeName="r"
                  values="12;14;12"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="200" cy="50" r="6" fill="#3B82F6">
                <animate
                  attributeName="r"
                  values="6;7;6"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
              <text
                x="220"
                y="55"
                fill="#1E40AF"
                fontSize="12"
                fontWeight="500"
              >
                Departure
                <tspan x="220" y="70" fill="#6B7280" fontSize="10">
                  {formatDate(trip.dates.start)}
                </tspan>
              </text>

              {/* Side Destinations */}
              <circle
                cx="200"
                cy="400"
                r="14"
                fill="#EFF6FF"
                stroke="#3B82F6"
                strokeWidth="2"
              >
                <animate
                  attributeName="r"
                  values="14;16;14"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="200" cy="400" r="7" fill="#3B82F6">
                <animate
                  attributeName="r"
                  values="7;8;7"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
              <text
                x="230"
                y="395"
                fill="#1E40AF"
                fontSize="12"
                fontWeight="500"
              >
                Side Trips
                <tspan x="230" y="410" fill="#6B7280" fontSize="10">
                  {trip.sideDestinations.join(", ")}
                </tspan>
              </text>

              {/* Main Destination */}
              <circle
                cx="180"
                cy="250"
                r="16"
                fill="#EFF6FF"
                stroke="#3B82F6"
                strokeWidth="2"
              >
                <animate
                  attributeName="r"
                  values="16;18;16"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="180" cy="250" r="8" fill="#3B82F6">
                <animate
                  attributeName="r"
                  values="8;9;8"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
              <text
                x="210"
                y="245"
                fill="#1E40AF"
                fontSize="12"
                fontWeight="500"
              >
                {trip.mainDestination}
                <tspan x="210" y="260" fill="#6B7280" fontSize="10">
                  Main Destination
                </tspan>
              </text>

              {/* End Point */}
              <circle
                cx="200"
                cy="550"
                r="12"
                fill="#EFF6FF"
                stroke="#3B82F6"
                strokeWidth="2"
              >
                <animate
                  attributeName="r"
                  values="12;14;12"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="200" cy="550" r="6" fill="#3B82F6">
                <animate
                  attributeName="r"
                  values="6;7;6"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
              <text
                x="220"
                y="555"
                fill="#1E40AF"
                fontSize="12"
                fontWeight="500"
              >
                Return
                <tspan x="220" y="570" fill="#6B7280" fontSize="10">
                  {formatDate(trip.dates.end)}
                </tspan>
              </text>
            </g>
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Destination Point</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <div className="w-4 h-1 bg-blue-500 rounded-full"></div>
              <span>Travel Path</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
        <p>
          Your trip to{" "}
          <span className="font-medium">{trip.mainDestination}</span> is
          scheduled for {formatDate(trip.dates.start)} to{" "}
          {formatDate(trip.dates.end)}.
        </p>
      </div>
    </div>
  );
};

export default TripGraph;
