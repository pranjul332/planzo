import React, { useState } from "react";
import { User, Plus, Search, X } from "lucide-react";
import Sidebar from "./Sidebar";
import TripCard from "./TripCard";
import TripDetails from "./TripDetails";
import AddMemberModal from "./AddMemberModal";


const TripsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [trips, setTrips] = useState([
    {
      id: 1,
      name: "Summer Beach Vacation",
      description: "Planning for summer 2025",
      members: 4,
      mainDestination: "Bali, Indonesia",
      sideDestinations: ["Nusa Penida", "Gili Islands", "Lombok"],
      budget: 5000,
      currentSpent: 3200,
      dates: { start: "2025-06-01", end: "2025-06-15" },
      summary:
        "A 2-week tropical getaway exploring the best of Indonesian islands.",
      memberDetails: [
        { id: 1, name: "John Doe", role: "Organizer" },
        { id: 2, name: "Jane Smith", role: "Member" },
        { id: 3, name: "Mike Johnson", role: "Member" },
        { id: 4, name: "Sarah Wilson", role: "Member" },
      ],
      expenses: [
        { category: "Accommodation", amount: 1500 },
        { category: "Transportation", amount: 800 },
        { category: "Activities", amount: 600 },
        { category: "Food", amount: 300 },
      ],
    },
    {
      id: 1,
      name: "Summer Beach Vacation",
      description: "Planning for summer 2025",
      members: 4,
      mainDestination: "Bali, Indonesia",
      sideDestinations: ["Nusa Penida", "Gili Islands", "Lombok"],
      budget: 5000,
      currentSpent: 3200,
      dates: { start: "2025-06-01", end: "2025-06-15" },
      summary:
        "A 2-week tropical getaway exploring the best of Indonesian islands.",
      memberDetails: [
        { id: 1, name: "John Doe", role: "Organizer" },
        { id: 2, name: "Jane Smith", role: "Member" },
        { id: 3, name: "Mike Johnson", role: "Member" },
        { id: 4, name: "Sarah Wilson", role: "Member" },
      ],
      expenses: [
        { category: "Accommodation", amount: 1500 },
        { category: "Transportation", amount: 800 },
        { category: "Activities", amount: 600 },
        { category: "Food", amount: 300 },
      ],
    },
  ]);

  const handleTripClick = (trip) => {
    setSelectedTrip(trip);
  };

  const handleAddMember = (newMember) => {
    if (selectedTrip) {
      const updatedTrips = trips.map((trip) => {
        if (trip.id === selectedTrip.id) {
          const updatedTrip = {
            ...trip,
            memberDetails: [...trip.memberDetails, newMember],
            members: trip.members + 1,
          };
          setSelectedTrip(updatedTrip);
          return updatedTrip;
        }
        return trip;
      });
      setTrips(updatedTrips);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 py-4">
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

              <div
                className="relative"
                onMouseEnter={() => setIsSidebarOpen(true)}
              >
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <User className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      <main className="container mx-auto px-4 pt-24 pb-8">
        {selectedTrip ? (
          <>
            <TripDetails
              trip={selectedTrip}
              onClose={() => setSelectedTrip(null)}
              onAddMember={() => setIsAddMemberModalOpen(true)}
            />
            
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onClick={() => handleTripClick(trip)}
                />
              ))}
            </div>
            <button className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors flex items-center justify-center group">
              <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
          </>
        )}
      </main>

      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        onAdd={handleAddMember}
      />
    </div>
  );
};

export default TripsPage;
