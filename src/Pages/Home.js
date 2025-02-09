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
import balloon from '../images/balloon.png'

const Home = () => {
  const [tripType, setTripType] = useState("oneWay");

  return (
    <div className="min-h-full bg-pink-200">
      <div className=" ">
        <div className="bg-">
          {/* Header */}
          <header className="bg-pink-200 py-3 px-4 shadow-sm">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="text-3xl font-bold text-gray-700">yatra</div>
              <div className="flex items-center gap-4">
                <button className="bg-gray-800 text-yellow-500 px-4 py-2 rounded-full">
                  JOIN <span className="italic">Planzo</span>PRIME
                </button>
                <button className=" bg-white flex items-center gap-2 px-4 py-2 rounded-full border">
                  <Building2 size={20} className="" />
                  Corporates/SME
                  <ChevronDown size={16} />
                </button>
                <button className="  bg-white  flex items-center gap-2 px-4 py-2 rounded-full border">
                  <PhoneCall size={20} />
                  For Travel Agents
                </button>
                <button className="bg-red-600 text-white px-6 py-2 rounded-lg">
                  Login / Signup
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}

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
                <button className="flex items-center gap-2 px-6 py-2 bg-red-50 text-red-600 rounded-full">
                  <Plane size={20} /> Flights
                </button>
                <button className="flex items-center gap-2 px-6 py-2">
                  <Hotel size={20} /> Hotels
                </button>
                <button className="flex items-center gap-2 px-6 py-2">
                  <Calendar size={20} /> Holidays
                </button>
                <button className="flex items-center gap-2 px-6 py-2">
                  <Bus size={20} /> Bus
                </button>
                <button className="flex items-center gap-2 px-6 py-2">
                  <Train size={20} /> Trains
                </button>
                <button className="flex items-center gap-2 px-6 py-2">
                  <Car size={20} /> Cabs
                </button>
                <div className="ml-auto">
                  <button className="flex items-center gap-2 text-blue-600">
                    <RefreshCw size={16} /> Claim your Covid Refund
                  </button>
                </div>
              </div>

              {/* Trip Type Selection */}
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

              {/* Search Form */}
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
                  <input
                    type="radio"
                    name="fareType"
                    className="text-gray-400"
                  />
                  <div>
                    <div className="font-medium">Student</div>
                    <div className="text-sm text-gray-500">Extra Baggage</div>
                  </div>
                </label>
                <label className="flex items-center gap-2 px-4 py-2 border rounded-lg">
                  <input
                    type="radio"
                    name="fareType"
                    className="text-gray-400"
                  />
                  <div>
                    <div className="font-medium">Armed Forces</div>
                    <div className="text-sm text-gray-500">Extra Discount</div>
                  </div>
                </label>
                <label className="flex items-center gap-2 px-4 py-2 border rounded-lg">
                  <input
                    type="radio"
                    name="fareType"
                    className="text-gray-400"
                  />
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
          <div className="min-h-screen w-full bg-slate-100">
            {/* Previous header and search form components remain the same... */}

            {/* Special Offers Section */}
            <div className="max-w-7xl mx-auto px-4 py-8 mt-8">
              <div className="bg-white rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Special Offers</h2>
                  <button className="text-blue-600 flex items-center gap-1">
                    View all offers <ChevronRight size={16} />
                  </button>
                </div>

                {/* Offer Categories */}
                <div className="flex gap-4 mb-6">
                  <button className="px-6 py-2 bg-red-50 rounded-full text-sm">
                    All
                  </button>
                  <button className="px-6 py-2 text-sm">Flights</button>
                  <button className="px-6 py-2 text-sm">Hotels</button>
                  <button className="px-6 py-2 text-sm">Holidays</button>
                  <button className="px-6 py-2 text-sm">Buses</button>
                  <button className="px-6 py-2 text-sm">Trains</button>
                  <button className="px-6 py-2 text-sm">
                    Valentine's Sale
                  </button>
                </div>

                {/* Offer Cards */}
                <div className="grid grid-cols-4 gap-4">
                  {[
                    {
                      bank: "ICICI Bank",
                      offer: "Flat 12% OFF (up to Rs. 1,500)",
                      image: "/api/placeholder/300/200",
                    },
                    {
                      bank: "Axis Bank",
                      offer: "Up to Rs. 2,000 + Easy EMI",
                      image: "/api/placeholder/300/200",
                    },
                    {
                      bank: "SBI Card",
                      offer: "Flat 12% OFF (Up to Rs. 1,500)",
                      image: "/api/placeholder/300/200",
                    },
                  ].map((offer, index) => (
                    <div
                      key={index}
                      className="border rounded-lg overflow-hidden"
                    >
                      <img
                        src={offer.image}
                        alt={offer.bank}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">{offer.offer}</h3>
                        <p className="text-sm text-gray-600">{offer.bank}</p>
                        <button className="mt-4 text-white bg-red-500 px-4 py-1 rounded-md text-sm">
                          KNOW MORE
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-6">
                  <h3 className="text-blue-600">Gift Vouchers</h3>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Recommended Hotels */}
            <div className="max-w-7xl mx-auto px-4 mt-8">
              <div className="bg-white rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-6">Recommended Hotels</h2>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    {
                      name: "Zone By The Park Kolkata",
                      location: "Kolkata",
                      price: "₹3,208",
                      rating: "5.0",
                    },
                    {
                      name: "Radisson Resort Goa",
                      location: "Goa",
                      price: "₹6,036",
                      rating: "5.0",
                    },
                    {
                      name: "The Park Hyderabad",
                      location: "Hyderabad",
                      price: "₹6,927",
                      rating: "5.0",
                    },
                    {
                      name: "The Park Bangalore",
                      location: "Bangalore",
                      price: "₹6,927",
                      rating: "5.0",
                    },
                  ].map((hotel, index) => (
                    <div
                      key={index}
                      className="border rounded-lg overflow-hidden"
                    >
                      <img
                        src="/api/placeholder/300/200"
                        alt={hotel.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{hotel.name}</h3>
                          <div className="flex items-center bg-green-100 px-2 py-1 rounded">
                            <Star size={12} className="text-yellow-500" />
                            <span className="text-sm ml-1">{hotel.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {hotel.location}
                        </p>
                        <p className="font-bold">{hotel.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Popular Destinations */}
            <div className="max-w-7xl mx-auto px-4 mt-8 pb-8">
              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-lg font-semibold">
                    Flights to Popular Domestic Destinations from
                  </h2>
                  <span className="font-bold">Delhi</span>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {[
                    { city: "Mumbai", price: "₹6,147" },
                    { city: "Bangalore", price: "₹10,071" },
                    { city: "Pune", price: "₹7,837" },
                    { city: "Kolkata", price: "₹9,323" },
                  ].map((destination, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg overflow-hidden h-48 group cursor-pointer"
                    >
                      <img
                        src="/api/placeholder/300/200"
                        alt={destination.city}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-lg font-bold">
                          {destination.city}
                        </h3>
                        <p className="text-sm">
                          Starting from {destination.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="text-blue-600 flex items-center gap-1 mt-4">
                  See all locations <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Cloud and Heart Decorations */}
            <div className="fixed left-8 top-1/4">
              <div className="bg-blue-200 w-32 h-16 rounded-full opacity-80"></div>
              <div className="absolute -top-4 -right-4">
                <div className="bg-red-500 w-8 h-8 transform rotate-45"></div>
              </div>
            </div>
            <div className="fixed right-8 top-1/3">
              <div className="bg-blue-200 w-40 h-20 rounded-full opacity-80"></div>
              <div className="absolute -top-6 -left-4">
                <div className="bg-red-500 w-12 h-12 transform rotate-45"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
