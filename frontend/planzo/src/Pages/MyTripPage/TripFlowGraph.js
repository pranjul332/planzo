import React from "react";

const TripFlowGraph = ({ trip }) => {
  // Make sure trip and its properties exist before accessing them
  const safeTrip = {
    mainDestination: trip?.mainDestination || "Main Destination",
    sideDestinations: Array.isArray(trip?.sideDestinations)
      ? trip.sideDestinations
      : [],
    dates: {
      start: trip?.dates?.start || new Date().toISOString(),
      end: trip?.dates?.end || new Date().toISOString(),
    },
  };

  // Format date with fallback
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "TBD";
    }
  };

  // Safely join side destinations as string
  const sideDestinationsText =
    safeTrip.sideDestinations
      .filter((dest) => typeof dest === "string")
      .join(", ") || "None";

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Trip Journey</h2>
      <div className="relative w-full max-w-3xl mx-auto h-[600px] bg-gradient-to-b from-blue-50/50 to-white rounded-lg p-6">
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
            <text x="220" y="55" fill="#1E40AF" fontSize="12" fontWeight="500">
              Departure
              <tspan x="220" y="70" fill="#6B7280" fontSize="10">
                {formatDate(safeTrip.dates.start)}
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
            <text x="230" y="395" fill="#1E40AF" fontSize="12" fontWeight="500">
              Side Trips
              <tspan x="230" y="410" fill="#6B7280" fontSize="10">
                {sideDestinationsText}
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
            <text x="210" y="245" fill="#1E40AF" fontSize="12" fontWeight="500">
              {safeTrip.mainDestination}
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
            <text x="220" y="555" fill="#1E40AF" fontSize="12" fontWeight="500">
              Return
              <tspan x="220" y="570" fill="#6B7280" fontSize="10">
                {formatDate(safeTrip.dates.end)}
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
    </div>
  );
};

export default TripFlowGraph;
