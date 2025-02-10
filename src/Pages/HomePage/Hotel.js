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

const Hote = ({setActiveComponent}) => {
  return (
    <div className=" h-1/2 bg-pink-200">
      {/* Hot Air Balloons - Decorative */}
      <div className="z-0">
        <div className="absolute left-0 top-0">
          <div className="w-24 h-32 bg-red-100 rounded-lg transform -rotate-12"></div>
        </div>
        <div className="absolute right-0 top-0">
          <div className="w-24 h-32 bg-red-100 rounded-lg transform rotate-12"></div>
        </div>
        <div className=" relative">
          <img
            src={balloon}
            alt="Hot Air Balloon"
            className="absolute mt-20 pt-5 left-20 ml-10 transform -translate-x-1/2 w-72 opacity-80"
          />
        </div>
      </div>
      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-6 ">
        <div className="bg-white rounded-2xl p-6 z-10">
          <div className="flex gap-6 mb-6">
            <Link
              className="flex items-center gap-2 px-6 py-2"
              onClick={() => setActiveComponent("flight")}
            >
              <Plane size={20} /> Flights
            </Link>
            <Link className="flex items-center gap-2 px-6 py-2 bg-red-50 text-red-600 rounded-full">
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
