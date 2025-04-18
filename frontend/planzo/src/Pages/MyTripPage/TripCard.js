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

  // Format date with fallback for missing or invalid dates
  const formatDate = (dateString) => {
    if (!dateString) return "TBD";

    try {
      return new Date(dateString).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "TBD";
    }
  };

  // Get formatted dates with fallbacks
  const startDate = formatDate(trip?.dates?.start);
  const endDate = formatDate(trip?.dates?.end);

  // Safe access to member details
  const memberDetails = trip?.memberDetails || [];
  const memberCount = trip?.members || memberDetails.length || 0;

  return (
    <div
      onClick={() => onClick(trip)}
      className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow relative p-5 border border-gray-100"
    >
      <div className="absolute top-4 right-4">
        
      </div>

      <h3 className="text-lg font-semibold mb-2">
        {trip?.name || "Unnamed Trip"}
      </h3>

      <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
        <MapPin className="w-4 h-4" />
        <span>{trip?.mainDestination || "No destination set"}</span>
      </div>

      <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
        <Calendar className="w-4 h-4" />
        <span>
          {startDate} - {endDate}
        </span>
      </div>

      <p className="text-gray-600 mb-4">
        {trip?.description || "No description available"}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center -space-x-2">
          {memberDetails.slice(0, 3).map((member, i) => (
            <div
              key={member.id || i}
              className="w-8 h-8 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center"
            >
              <span className="text-sm text-purple-600 font-medium">
                {(member.name || "?").charAt(0)}
              </span>
            </div>
          ))}
          {memberCount > 3 && (
            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
              <span className="text-sm text-gray-600 font-medium">
                +{memberCount - 3}
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
