import React, { useState } from "react";
import {
  User,
  Plus,
  Search,
  X,
  Plane,
  MapPin,
  Calendar,
  Palmtree,
  Heart,
  Sunrise,
  Moon,
  Cloud,
  Rainbow,
} from "lucide-react";
import Sidebar from "./Sidebar";
import TripCard from "./TripCard";
import TripDetails from "./TripDetails";
import AddMemberModal from "./AddMemberModal";
import CreateTripModal from "./CreateTrip";

const EmptyState = () => (
  <div className="text-center py-16">
    <div className="flex justify-center mb-6">
      <Plane className="w-16 h-16 text-blue-400 animate-bounce" />
    </div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">
      No trips yet! ✈️
    </h3>
    <p className="text-gray-500 mb-6">Time to plan your next adventure!</p>
  </div>
);

const WelcomeBanner = () => (
  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-6 mb-8 relative overflow-hidden">
    <div className="absolute top-0 right-0 opacity-10">
      <Rainbow className="w-32 h-32 text-white" />
    </div>
    <div className="relative z-10">
      <h1 className="text-white text-2xl font-bold mb-2">
        Welcome to Your Travel Hub! 🌈
      </h1>
      <p className="text-blue-100">
        Where every journey begins with a dream ✨
      </p>
    </div>
  </div>
);

const WeatherIcon = ({ time }) => {
  if (time === "day") return <Sunrise className="w-6 h-6" />;
  return <Moon className="w-6 h-6" />;
};

const TripsPage = () => {
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false);
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
      id: 2,
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
  // In your TripsPage component, update the handleCreateTrip function:
  const handleCreateTrip = (newTrip) => {
    const formattedTrip = {
      id: Date.now(),
      name: newTrip.name,
      description: newTrip.description,
      members: newTrip.members.length,
      mainDestination: newTrip.mainDestination,
      sideDestinations: [], // Initialize with empty array
      budget: parseInt(newTrip.budget),
      currentSpent: 0,
      dates: {
        start: newTrip.startDate,
        end: newTrip.endDate,
      },
      summary: newTrip.description,
      memberDetails: newTrip.members.map((member) => ({
        id: member.id,
        name: member.name,
        role: member.role,
      })),
      expenses: [], // Initialize with empty array
    };

    setTrips((prevTrips) => [...prevTrips, formattedTrip]);
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <header className="bg-white shadow-lg fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Palmtree className="w-8 h-8 text-purple-500" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                    Planzo
                  </span>
                  <span className="text-sm text-gray-500">
                    My Adventures ✨
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your adventures... 🔍"
                  className="pl-12 pr-6 py-3 w-72 rounded-full border-2 border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all duration-200 hover:border-purple-200"
                />
              </div>

              <div
                className="relative"
                onMouseEnter={() => setIsSidebarOpen(true)}
              >
                <button className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center hover:opacity-90 transition-opacity">
                  <User className="w-6 h-6 text-white" />
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

      <main className="container mx-auto px-6 pt-28 pb-8">
        {!selectedTrip && <WelcomeBanner />}

        {selectedTrip ? (
          <TripDetails
            trip={selectedTrip}
            onClose={() => setSelectedTrip(null)}
            onAddMember={() => setIsAddMemberModalOpen(true)}
          />
        ) : (
          <>
            {trips.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    onClick={() => handleTripClick(trip)}
                  />
                ))}
              </div>
            )}
            <button
              onClick={() => setIsCreateTripModalOpen(true)}
              className="fixed bottom-8 right-8 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full shadow-lg hover:opacity-90 transition-all duration-200 flex items-center gap-2 group"
            >
              <Plus className="w-6 h-6 group-hover:rotate-180 transition-transform duration-300" />
              <span className="font-medium">New Adventure</span>
            </button>
          </>
        )}
      </main>

      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        onAdd={handleAddMember}
      />
      <CreateTripModal
        isOpen={isCreateTripModalOpen}
        onClose={() => setIsCreateTripModalOpen(false)}
        onCreateTrip={handleCreateTrip}
      />
    </div>
  );
};

export default TripsPage;