import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";
import { MapPin, Globe, Sun, Plane } from "lucide-react";

// Mock destinations data (would typically come from an API)
const destinations = [
  {
    id: 1,
    name: 'Bali, Indonesia',
    description: 'Tropical paradise with stunning beaches and rich culture',
    image: '/api/placeholder/400/300',
    averageCost: '$1500-$2500',
    highlights: ['Beaches', 'Temples', 'Surfing']
  },
  {
    id: 2,
    name: 'Paris, France',
    description: 'The city of love and lights',
    image: '/api/placeholder/400/300',
    averageCost: '$2000-$3000',
    highlights: ['Eiffel Tower', 'Louvre', 'Cuisine']
  },
  {
    id: 3,
    name: 'Tokyo, Japan',
    description: 'A perfect blend of ultra-modern and traditional',
    image: '/api/placeholder/400/300',
    averageCost: '$2500-$3500',
    highlights: ['Technology', 'Temples', 'Food']
  },
  {
    id: 4,
    name: 'Maldives',
    description: 'Tropical paradise with crystal clear waters',
    image: '/api/placeholder/400/300',
    averageCost: '$3000-$5000',
    highlights: ['Luxury Resorts', 'Snorkeling', 'Beach']
  }
];

const HomePage = () => {
  // State for login dialog
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  
  // State for selected destination
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Handler for planning a trip
  const handlePlanTrip = (destination) => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('token');

    if (isLoggedIn) {
      // Redirect to booking page
      // In a real app, you'd use React Router
      window.location.href = `/booking/${destination.id}`;
    } else {
      // Show login required dialog
      setSelectedDestination(destination);
      setShowLoginDialog(true);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Discover Amazing Destinations
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {destinations.map((destination) => (
          <Card 
            key={destination.id} 
            className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2" /> {destination.name}
              </CardTitle>
              <CardDescription>{destination.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <img 
                  src={destination.image} 
                  alt={destination.name} 
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Average Cost</p>
                  <p>{destination.averageCost}</p>
                </div>
                <div>
                  <p className="font-semibold">Highlights</p>
                  <div className="flex space-x-2">
                    {destination.highlights.map((highlight, index) => (
                      <span 
                        key={index} 
                        className="text-xs bg-blue-100 px-2 py-1 rounded"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handlePlanTrip(destination)} 
                className="w-full"
              >
                <Plane className="mr-2" /> Plan Trip
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Login Required Dialog */}
      <Dialog 
        open={showLoginDialog}  
        onOpenChange={setShowLoginDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to sign in to plan a trip to {selectedDestination?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between">
            <Button 
              variant="outline"
              onClick={() => setShowLoginDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                // Redirect to login page
                window.location.href = '/login';
              }}
            >
              Go to Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;