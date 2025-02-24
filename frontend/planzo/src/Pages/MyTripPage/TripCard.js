import React, { useState, useEffect, useRef } from "react";
import { Users, MoreVertical, MapPin, Calendar } from "lucide-react";

const TripCard = ({ trip, onClick }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleMenuItemClick = (e, action) => {
    e.stopPropagation();
    setShowMenu(false);
    // Handle menu actions
    console.log(`${action} clicked`);
  };

  return (
    <div
      onClick={() => onClick(trip)}
      className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow relative p-5 border border-gray-100"
    >
      <div className="absolute top-4 right-4">
        <button
          ref={buttonRef}
          onClick={handleMenuClick}
          className="p-1.5 hover:bg-gray-100 rounded-full"
        >
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>

        {showMenu && (
          <div
            ref={menuRef}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10"
          >
            <button
              onClick={(e) => handleMenuItemClick(e, "edit")}
              className="w-full text-left px-4 py-2 hover:bg-gray-50"
            >
              Edit Trip
            </button>
            <button
              onClick={(e) => handleMenuItemClick(e, "share")}
              className="w-full text-left px-4 py-2 hover:bg-gray-50"
            >
              Share Trip
            </button>
            <button
              onClick={(e) => handleMenuItemClick(e, "delete")}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
            >
              Delete Trip
            </button>
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold mb-2">{trip.name}</h3>

      <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
        <MapPin className="w-4 h-4" />
        <span>{trip.mainDestination}</span>
      </div>

      <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
        <Calendar className="w-4 h-4" />
        <span>
          {new Date(trip.dates.start).toLocaleDateString()} -{" "}
          {new Date(trip.dates.end).toLocaleDateString()}
        </span>
      </div>

      <p className="text-gray-600 mb-4">{trip.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center -space-x-2">
          {trip.memberDetails.slice(0, 3).map((member, i) => (
            <div
              key={member.id}
              className="w-8 h-8 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center"
            >
              <span className="text-sm text-purple-600 font-medium">
                {member.name.charAt(0)}
              </span>
            </div>
          ))}
          {trip.members > 3 && (
            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
              <span className="text-sm text-gray-600 font-medium">
                +{trip.members - 3}
              </span>
            </div>
          )}
        </div>

        <span className="text-purple-600 text-sm font-medium">
          View Details
        </span>
      </div>
    </div>
  );
};

export default TripCard;
