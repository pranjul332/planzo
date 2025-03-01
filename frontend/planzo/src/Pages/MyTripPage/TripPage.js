import React, { useState, useEffect } from "react";
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
import { useTripService } from "../../services/tripService"; // Import the hook

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
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get tripService methods from the hook
  const { createTrip, getTrips, getTripById } = useTripService();

  // Fetch trips on component mount
  useEffect(() => {
    fetchTrips();
  }, []);

  // Function to fetch trips from API
  const fetchTrips = async () => {
    try {
      setLoading(true);
      const fetchedTrips = await getTrips();

      // Format the trips data to ensure consistent structure
      const formattedTrips = fetchedTrips.map((trip) => ({
        id: trip.id,
        name: trip.name || "Unnamed Trip",
        description: trip.description || "",
        members: trip.members || 0,
        mainDestination: trip.mainDestination || "",
        // Ensure dates object exists
        dates: {
          start: trip.dates?.start || null,
          end: trip.dates?.end || null,
        },
        // Add other properties with fallbacks
        budget: trip.budget || 0,
        currentSpent: trip.currentSpent || 0,
        memberDetails: trip.memberDetails || [],
        expenses: trip.expenses || [],
        sideDestinations: trip.sideDestinations || [],
        summary: trip.summary || trip.description || "",
      }));

      setTrips(formattedTrips);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch trips:", err);
      setError("Failed to load trips. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

 const handleTripClick = async (trip) => {
   try {
     // Get detailed trip information when a trip is clicked
     const detailedTrip = await getTripById(trip.id);

     // Format the detailed trip data
     const formattedTrip = {
       id: detailedTrip.id,
       name: detailedTrip.name || "Unnamed Trip",
       description: detailedTrip.description || "",
       members: detailedTrip.members || 0,
       mainDestination: detailedTrip.mainDestination || "",
       // Ensure dates object exists
       dates: {
         start: detailedTrip.dates?.start || null,
         end: detailedTrip.dates?.end || null,
       },
       // Add other properties with fallbacks
       budget: detailedTrip.budget || 0,
       currentSpent: detailedTrip.currentSpent || 0,
       memberDetails: detailedTrip.memberDetails || [],
       expenses: detailedTrip.expenses || [],
       sideDestinations: detailedTrip.sideDestinations || [],
       summary: detailedTrip.summary || detailedTrip.description || "",
     };

     setSelectedTrip(formattedTrip);
   } catch (err) {
     console.error("Failed to fetch trip details:", err);
     // Fallback to using the basic trip data if detailed fetch fails
     // Make sure this trip data is also properly formatted
     const formattedFallbackTrip = {
       ...trip,
       dates: trip.dates || { start: null, end: null },
       memberDetails: trip.memberDetails || [],
       expenses: trip.expenses || [],
       sideDestinations: trip.sideDestinations || [],
     };
     setSelectedTrip(formattedFallbackTrip);
   }
 };

  // Updated to use the API service
  const handleCreateTrip = async (newTripData) => {
    try {
      // Format trip data as needed for your API
      const formattedTrip = {
        name: newTripData.name,
        description: newTripData.description,
        mainDestination: newTripData.mainDestination,
        budget: parseInt(newTripData.budget),
        dates: {
          start: newTripData.startDate,
          end: newTripData.endDate,
        },
        members: newTripData.members.map((member) => ({
          name: member.name,
          role: member.role,
        })),
      };

      // Create trip via API
      await createTrip(formattedTrip);

      // Refresh trips list
      fetchTrips();

      // Close modal
      setIsCreateTripModalOpen(false);
    } catch (err) {
      console.error("Failed to create trip:", err);
      alert("Failed to create trip. Please try again later.");
    }
  };

  const handleAddMember = async (newMember) => {
    if (selectedTrip) {
      try {
        // Here you would typically call an API to add a member
        // For now, we'll just update the local state
        const updatedTrips = trips.map((trip) => {
          if (trip.id === selectedTrip.id) {
            const updatedTrip = {
              ...trip,
              memberDetails: [...(trip.memberDetails || []), newMember],
              members: (trip.memberDetails?.length || 0) + 1,
            };
            setSelectedTrip(updatedTrip);
            return updatedTrip;
          }
          return trip;
        });
        setTrips(updatedTrips);
        setIsAddMemberModalOpen(false);

        // In a real implementation, you would refresh the trip details
        // const refreshedTrip = await getTripById(selectedTrip.id);
        // setSelectedTrip(refreshedTrip);
      } catch (err) {
        console.error("Failed to add member:", err);
        alert("Failed to add member. Please try again.");
      }
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
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-16 text-red-500">
                <p>{error}</p>
                <button
                  onClick={fetchTrips}
                  className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : trips.length === 0 ? (
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
