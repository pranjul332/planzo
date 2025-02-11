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
import Home from "./Home";
const Fligh = React.memo(({setActiveComponent}) => {
      const [tripType, setTripType] = useState("oneWay");
    // const [activeSearch, setActiveSearch] = useState("flights");
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 pb-6 ">
        {/* Hot Air Balloons - Decorative */}

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
            className="absolute mt-40 pt-10 left-1 transform -translate-x-1/2 w-72 opacity-80"
          />
        </div>

        {/* Booking Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 relative z-10">
          {/* Travel Options */}
          <div className="flex gap-6 mb-6">
            <Link
              to="/flights"
              className="flex items-center gap-2 px-6 py-2 bg-red-50 text-red-600 rounded-full"
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

          {/* Trip Type Selection */}
          <div>
            <div>
              <div className="flex gap-6 mb-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tripType"
                    value="oneWay"
                    checked={tripType === "oneWay"}
                    onChange={(e) => setTripType(e.target.value)}
                    className="text-red-600"
                  />
                  One Way
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tripType"
                    value="roundTrip"
                    checked={tripType === "roundTrip"}
                    onChange={(e) => setTripType(e.target.value)}
                    className="text-gray-400"
                  />
                  Round Trip
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tripType"
                    value="multiCity"
                    checked={tripType === "multiCity"}
                    onChange={(e) => setTripType(e.target.value)}
                    className="text-gray-400"
                  />
                  Multi City
                </label>
              </div>

              <div className="grid grid-cols-5 gap-4">
                <div className="space-y-1 col-span-1">
                  <label className="text-sm text-gray-600">
                    Departure From
                  </label>
                  <div className="border rounded-lg p-3">
                    <div className="text-xl font-semibold">New Delhi</div>
                    <div className="text-sm text-gray-500">
                      DEL, Indira Gandhi Internati...
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <button className="p-2 rounded-full border">
                    <ArrowRightLeft size={20} />
                  </button>
                </div>

                <div className="space-y-1 col-span-1">
                  <label className="text-sm text-gray-600">Going To</label>
                  <div className="border rounded-lg p-3">
                    <div className="text-xl font-semibold">Mumbai</div>
                    <div className="text-sm text-gray-500">
                      BOM, Chhatrapati Shivaji Int...
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-gray-600">
                    Departure Date
                  </label>
                  <div className="border rounded-lg p-3">
                    <div className="text-xl font-semibold">10 Feb'25</div>
                    <div className="text-sm text-gray-500">Monday</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm text-gray-600">
                    Travellers & Class
                  </label>
                  <div className="border rounded-lg p-3">
                    <div className="text-xl font-semibold">1 Traveller</div>
                    <div className="text-sm text-gray-500">Economy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Special Fares */}
          <div className="flex gap-4 mt-6">
            <label className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg">
              <input
                type="radio"
                name="fareType"
                className="text-red-600"
                checked
              />
              <div>
                <div className="font-medium">Regular</div>
                <div className="text-sm text-gray-500">Regular Fares</div>
              </div>
            </label>
            <label className="flex items-center gap-2 px-4 py-2 border rounded-lg">
              <input type="radio" name="fareType" className="text-gray-400" />
              <div>
                <div className="font-medium">Student</div>
                <div className="text-sm text-gray-500">Extra Baggage</div>
              </div>
            </label>
            <label className="flex items-center gap-2 px-4 py-2 border rounded-lg">
              <input type="radio" name="fareType" className="text-gray-400" />
              <div>
                <div className="font-medium">Armed Forces</div>
                <div className="text-sm text-gray-500">Extra Discount</div>
              </div>
            </label>
            <label className="flex items-center gap-2 px-4 py-2 border rounded-lg">
              <input type="radio" name="fareType" className="text-gray-400" />
              <div>
                <div className="font-medium">Senior Citizen</div>
                <div className="text-sm text-gray-500">Extra Discount</div>
              </div>
            </label>
            <label className="flex items-center gap-2 ml-auto">
              <input type="checkbox" className="text-red-600" checked />
              Non-Stop Flights
            </label>
          </div>

          {/* Search Button */}
          <div className="flex justify-end mt-6">
            <button className="bg-red-600 text-white px-12 py-3 rounded-lg text-lg font-medium">
              Search
            </button>
          </div>
        </div>
      </div>
      {/* <Home/> */}
    </div>
  );
});

export default Fligh;
