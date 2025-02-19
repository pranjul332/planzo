import React, { useState } from "react";
import { Users, MoreVertical, MapPin, Calendar } from "lucide-react";

const TripCard = ({ trip ,onClick}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      onClick={() => onClick(trip)}
      className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow relative p-5 border border-gray-100"
    >
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1.5 hover:bg-gray-100 rounded-full"
        >
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100 z-10">
            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              Edit Trip
            </button>
            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              Share Trip
            </button>
            <div className="h-px bg-gray-100 my-1"></div>
            <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
              Delete Trip
            </button>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-lg text-gray-800 mb-2">
          {trip.name}
        </h3>
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>Bali, Indonesia</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Dec 2024</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm">{trip.description}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center"
            >
              <Users className="w-4 h-4 text-gray-500" />
            </div>
          ))}
          {trip.members > 3 && (
            <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center">
              <span className="text-xs text-purple-600 font-medium">
                +{trip.members - 3}
              </span>
            </div>
          )}
        </div>
        <button className="px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
};

export default TripCard;
