import React, { useState } from "react";
import {
  Plane,
  Hotel,
  Train,
  Bus,
  Car,
  Calendar,
  PhoneCall,
  Building2,
  ChevronDown,
  ArrowRightLeft,
  RefreshCw,
  ChevronRight,
  Star,
} from "lucide-react";
import balloon from "../../images/balloon.png";
import { Link } from "react-router-dom";

const Hote = () => {
  return (
    <div className=" h-1/2 bg-pink-200">
      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="bg-white rounded-2xl p-6">
          <div className="flex gap-6 mb-6">
            <Link
              to="/flights"
              className="flex items-center gap-2 px-6 py-2 bg-red-50 text-red-600 rounded-full"
            >
              <Plane size={20} /> Flights
            </Link>
            <Link to="/hotels" className="flex items-center gap-2 px-6 py-2">
              <Calendar size={20} /> Hotels
            </Link>
            <Link to="/holidays" className="flex items-center gap-2 px-6 py-2">
              <Calendar size={20} /> Holidays
            </Link>
            <Link to="/bus" className="flex items-center gap-2 px-6 py-2">
              <Bus size={20} /> Bus
            </Link>
            <Link to="trains" className="flex items-center gap-2 px-6 py-2">
              <Train size={20} /> Trains
            </Link>
            <Link to="cabs" className="flex items-center gap-2 px-6 py-2">
              <Car size={20} /> Cabs
            </Link>
            <div className="ml-auto">
              <button className="flex items-center gap-2 text-blue-600">
                <RefreshCw size={16} /> Claim your Covid Refund
              </button>
            </div>
          </div>

          {/* Search Form */}
          <div className="grid grid-cols-4 gap-4">
            {/* City Selection */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600">
                Select City, Location or Hotel Name
              </label>
              <div className="border rounded-lg p-3">
                <div className="text-xl font-semibold">New Delhi</div>
                <div className="text-sm text-gray-500">DEL</div>
              </div>
            </div>

            {/* Check-in */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600">Check-in</label>
              <div className="border rounded-lg p-3">
                <div className="text-xl font-semibold">11 Feb' 25</div>
                <div className="text-sm text-gray-500">Tuesday</div>
              </div>
            </div>

            {/* Check-out */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600">Check-out</label>
              <div className="border rounded-lg p-3">
                <div className="text-xl font-semibold">13 Feb' 25</div>
                <div className="text-sm text-gray-500">Thursday</div>
              </div>
            </div>

            {/* Rooms & Guests */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600">Rooms & Guests</label>
              <div className="border rounded-lg p-3">
                <div className="text-xl font-semibold">
                  2 Travellers, 1 Room
                </div>
                <div className="text-sm text-gray-500">2 Adults</div>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-end mt-6">
            <button className="bg-red-600 text-white px-12 py-3 rounded-lg text-lg font-medium">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hote;
