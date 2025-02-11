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

const Holidays = ({ setActiveComponent }) => {
  return (
    <div className=" h-1/2 bg-pink-200 ">
      {/* Main Content Card */}
      <div className="max-w-[76rem] mx-auto  mt-4 bg-white rounded-xl shadow-sm p-8">
        {/* Travel Options */}
        <div className="flex gap-6 mb-6">
          <Link
            to="/flights"
            className="flex items-center gap-2 px-6 py-2"
            onClick={() => setActiveComponent("flight")}
          >
            <Plane size={20} /> Flights
          </Link>
          <Link
            to="/hotels"
            className="flex items-center gap-2 px-6 py-2"
            onClick={() => setActiveComponent("hotel")}
          >
            <Calendar size={20} /> Hotels
          </Link>
          <Link
            to="/holidays"
            className="flex items-center gap-2 px-6 py-2 bg-red-50 text-red-600 rounded-full"
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
            className="flex items-center gap-2 px-6 py-2"
            onClick={() => setActiveComponent("trains")}
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
        <div className="grid grid-cols-3 gap-8 ">
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Depart From</label>
            <div className="p-3 border rounded-lg">
              <div className="font-medium">New Delhi</div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600">Going To</label>
            <div className="p-3 border rounded-lg">
              <div className="font-medium">Ladakh</div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600">
              Month of Travel(Optional)
            </label>
            <select className="w-full p-3 border rounded-lg bg-white">
              <option>Select Month</option>
              <option>February 2025</option>
              <option>March 2025</option>
              <option>April 2025</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-8 flex justify-end">
          <button className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Holidays;
