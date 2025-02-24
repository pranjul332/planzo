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
const Trai = ({ setActiveComponent }) => {
  return (
    <div className="h-1/2 bg-pink-200">
      {/* Hot Air Balloons & Decorative Elements */}

      {/* Floating Hearts and Clouds */}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto mt-4 bg-white rounded-xl  shadow-lg p-6">
        {/* Navigation Tabs */}
        <div className="flex gap-6 mb-6">
          <Link
            to="/flights"
            className="flex items-center gap-2 px-6 py-2"
            onClick={() => setActiveComponent("flight")}
          >
            <Plane size={20} /> Flights
          </Link>
          <Link to="/hotels" className="flex items-center gap-2 px-6 py-2">
            <Calendar size={20} /> Hotels
          </Link>
          <Link
            to="/holidays" 

            className="flex items-center gap-2 px-6 py-2"
            onClick={() => setActiveComponent("holidays")}
          >
            <Calendar size={20} /> Holidays
          </Link>
          
          <Link
            to="/bus"
            className="flex items-center gap-2 px-6 py-2"
            onClick={() => setActiveComponent("bus")}
          >
            <Bus size={20} /> Bus
          </Link>
          <Link
            to="/trains"
            className="flex items-center gap-2 px-6 py-2 bg-red-50 text-red-600 rounded-full"
          >
            <Train size={20} /> Trains
          </Link>
          <Link
            to="/cabs"
            className="flex items-center gap-2 px-6 py-2"
            onClick={() => setActiveComponent("cabs")}
          >
            <Car size={20} /> Cabs
          </Link>
          <div className="ml-auto">
            <button className="flex items-center gap-2 text-blue-600">
              <RefreshCw size={16} /> Claim your Covid Refund
            </button>
          </div>
        </div>

        {/* Search Form */}
        <div className="grid grid-cols-3 gap-20 items-end">
          <div className="space-y-2 relative mr-16">
            <label className="text-sm text-gray-600">Depart From</label>
            <div className="p-3 border rounded-lg">
              <div className="text-xl font-medium">New Delhi</div>
              <div className="text-sm text-gray-500">NDLS</div>
            </div>
          </div>

          <div className="space-y-2 relative ml-16">
            <div className="p-3">
              <ArrowRightLeft className="absolute top-1/2 -left-32 z-10 w-8 h-8 p-1.5 bg-white rounded-full border " />
            </div>
            <label className="text-sm text-gray-600">Going To</label>
            <div className="p-3 border rounded-lg">
              <div className="text-xl font-medium">Mumbai Central</div>
              <div className="text-sm text-gray-500">BCT</div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">Depart Date</label>
            <div className="p-3 border rounded-lg">
              <div className="text-xl font-medium">12 Feb' 25</div>
              <div className="text-sm text-gray-500">Wednesday</div>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-8 flex justify-end">
          <button className="px-12 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 text-lg">
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Trai;
