import React, { useState } from "react";
import { User, Plus, Search } from "lucide-react";
import Sidebar from "./Sidebar";
import TripCard from "./TripCard";

const TripsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [trips] = useState([
    {
      id: 1,
      name: "Summer Beach Vacation",
      description: "Planning for summer 2025",
      members: 4,
    },
    {
      id: 2,
      name: "Mountain Hiking",
      description: "Weekend getaway",
      members: 2,
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-purple-600">Planzo</span>
              <span className="text-sm text-gray-500 mt-1">My Trips</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search trips..."
                  className="pl-10 pr-4 py-2 w-64 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>

              <div className="relative" onMouseEnter={() => setIsOpen(true)}>
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <User className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Sidebar isOpen={isOpen} closeSidebar={() => setIsOpen(false)} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </main>

      <button className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors flex items-center justify-center group">
        <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
};

export default TripsPage;
