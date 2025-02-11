import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Wallet,
  Users2,
  Map,
  Palette,
  Info
} from "lucide-react";
import { Link } from "react-router-dom";

const Booking = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    "/api/placeholder/1200/600",
    "/api/placeholder/1200/600",
    "/api/placeholder/1200/600",
    "/api/placeholder/1200/600",
  ];

  const thumbnails = [
    "/api/placeholder/150/100",
    "/api/placeholder/150/100",
    "/api/placeholder/150/100",
    "/api/placeholder/150/100",
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Breadcrumb */}
      <div className="text-sm mb-4">
        <Link to="/" className="text-blue-600">
          Home
        </Link>{" "}
        {" > "}
        <Link to="/holidays" className="text-blue-600">
          Holidays
        </Link>{" "}
        {" > "}
        <span>Leh & Nubra Valley, A Dream Destination</span>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column */}
        <div className="lg:w-3/4">
          <h1 className="text-2xl font-semibold mb-4">
            Leh & Nubra Valley, A Dream Destination
          </h1>

          {/* Tabs */}
          <div className="flex border-b mb-4 gap-5">
            {["Photos", "Hotels", "About the Place"].map((tab, index) => (
              <button
                key={index}
                className={`px-4 py-2 ${
                  index === 0 ? "text-red-600 border-b-2 border-red-600" : ""
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Image Gallery */}
          <div className="relative">
            <img
              src={images[currentImageIndex]}
              alt="Destination"
              className="w-full h-[400px] object-cover rounded-lg"
            />
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white"
            >
              <ChevronRight />
            </button>
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded">
              {currentImageIndex + 1}/{images.length}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 mt-4">
            {thumbnails.map((thumb, index) => (
              <img
                key={index}
                src={thumb}
                alt={`Thumbnail ${index + 1}`}
                className={`w-24 h-16 object-cover cursor-pointer rounded ${
                  index === currentImageIndex ? "border-2 border-red-600" : ""
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>

          {/* Inclusions and Themes */}
          <div className="grid grid-cols-1 gap-4 mt-8">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold mb-4">Themes</h3>
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <Users className="h-6 w-6 text-gray-600" />
                  <span className="text-gray-600 text-sm">Group Tours</span>
                </div>
                <div className="flex flex-col items-center">
                  <Wallet className="h-6 w-6 text-gray-600" />
                  <span className="text-gray-600 text-sm">Affordable</span>
                </div>
                <div className="flex flex-col items-center">
                  <Users2 className="h-6 w-6 text-gray-600" />
                  <span className="text-gray-600 text-sm">Family</span>
                </div>
                <div className="flex flex-col items-center">
                  <Map className="h-6 w-6 text-gray-600" />
                  <span className="text-gray-600 text-sm">Road Trip</span>
                </div>
                <div className="flex flex-col items-center">
                  <Palette className="h-6 w-6 text-gray-600" />
                  <span className="text-gray-600 text-sm">Art & Culture</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Estimated Cost</span>
                <div className="relative group">
                  <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-52 p-2 bg-gray-800 text-white text-xs rounded hidden group-hover:block z-10">
                    This is Estimated cost generated for  
                    <span className="font-bold text-red-400"> 1 Person </span> it may vary according to your
                    plan and group
                    <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold">₹25,734</div>
            </div>
            <button className="w-full bg-red-600 text-white py-2 rounded mb-2">
              Plan Now
            </button>
            <button className="w-full bg-gray-800 text-white py-2 rounded">
              Contact Seller
            </button>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Customizable Tour</h3>
              <p className="text-sm text-gray-600">
                Customizable tour where you may choose transport, stay, &
                sightseeing as per your taste & comfort
              </p>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Stay Plan</h3>
              <div className="text-sm">
                <div>Leh - 2 Nights</div>
                <div>Nubra Valley - 2 Nights</div>
                <div>Leh - 1 Night</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
