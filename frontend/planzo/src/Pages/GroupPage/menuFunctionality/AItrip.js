import React, { useState, useEffect } from "react";
import {
  BrainCircuit,
  PlaneTakeoff,
  CalendarDays,
  DollarSign,
  Users,
  Compass,
  Map,
  Clock,
  CheckCircle,
  Loader2,
  Download,
  Share2,
  Send,
  ChevronDown,
  ChevronUp,
  Pin,
  Globe,
  Hotel,
  Utensils,
  Camera,
  Car,
  X,
  Info,
  Sun,
  Moon,
  Coffee,
  ListChecks,
  Heart,
  Star,
} from "lucide-react";

const AITrip = ({
  initialDestination = "",
  initialBudget = "",
  initialDate = "",
  onSendToChat,
}) => {
  const [destination, setDestination] = useState(initialDestination);
  const [budget, setBudget] = useState(initialBudget);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const [activeView, setActiveView] = useState("form"); // form, plan, or map
  const [savedPlans, setSavedPlans] = useState([]);
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [showTips, setShowTips] = useState(false);

  // Predefined interests for selection
  const interestOptions = [
    "Adventure",
    "Beach",
    "Culture",
    "Food",
    "History",
    "Nature",
    "Nightlife",
    "Relaxation",
    "Shopping",
    "Sports",
  ];

  useEffect(() => {
    // Load saved plans from localStorage
    const loadSavedPlans = () => {
      try {
        const saved = localStorage.getItem("savedTripPlans");
        if (saved) {
          setSavedPlans(JSON.parse(saved));
        }
      } catch (err) {
        console.error("Error loading saved plans:", err);
      }
    };

    loadSavedPlans();

    // Auto-set dates if they're not already set
    if (!startDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setStartDate(formatDate(tomorrow));

      const threedays = new Date();
      threedays.setDate(threedays.getDate() + 4);
      setEndDate(formatDate(threedays));
    }
  }, []);

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };
  
  const toggleInterest = (interest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleGenerate = () => {
    if (!destination) return;

    setLoading(true);

    // Mock API call to generate trip plan
    setTimeout(() => {
      // This is where you'd call your actual API
      const mockPlan = generateMockPlan(
        destination,
        startDate,
        endDate,
        budget,
        travelers,
        interests
      );
      setPlan(mockPlan);
      setLoading(false);
      setActiveView("plan");

      // Save the plan
      const planId = Date.now().toString();
      setCurrentPlanId(planId);

      const newPlan = {
        id: planId,
        destination,
        startDate,
        endDate,
        budget,
        travelers,
        interests: [...interests],
        plan: mockPlan,
        createdAt: new Date().toISOString(),
      };

      const updatedPlans = [...savedPlans, newPlan];
      setSavedPlans(updatedPlans);

      try {
        localStorage.setItem("savedTripPlans", JSON.stringify(updatedPlans));
      } catch (err) {
        console.error("Error saving plan:", err);
      }
    }, 2000);
  };

  
  const toggleDayExpansion = (dayIndex) => {
    if (expandedDay === dayIndex) {
      setExpandedDay(null);
    } else {
      setExpandedDay(dayIndex);
    }
  };

  const handleSendToChatBox = (text) => {
    if (onSendToChat && typeof onSendToChat === "function") {
      onSendToChat(text);
    } else {
      console.log("Sending to chat:", text);
    }
  };

  const loadSavedPlan = (planId) => {
    const plan = savedPlans.find((p) => p.id === planId);
    if (plan) {
      setDestination(plan.destination);
      setStartDate(plan.startDate);
      setEndDate(plan.endDate);
      setBudget(plan.budget);
      setTravelers(plan.travelers);
      setInterests(plan.interests);
      setPlan(plan.plan);
      setCurrentPlanId(planId);
      setActiveView("plan");
    }
  };

  const deleteSavedPlan = (planId, e) => {
    e.stopPropagation();
    const updatedPlans = savedPlans.filter((p) => p.id !== planId);
    setSavedPlans(updatedPlans);

    try {
      localStorage.setItem("savedTripPlans", JSON.stringify(updatedPlans));
    } catch (err) {
      console.error("Error saving updated plans:", err);
    }

    if (currentPlanId === planId) {
      setPlan(null);
      setActiveView("form");
      setCurrentPlanId(null);
    }
  };

  const calculateTripLength = () => {
    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the difference in days
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays + 1; // Include both start and end days
  };

  const tripLength = calculateTripLength();

  const renderForm = () => (
    <div className="space-y-4 bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-gray-800 text-lg">
          Plan Your Dream Trip
        </h4>
        <button
          onClick={() => setShowTips(!showTips)}
          className="text-gray-500 hover:text-purple-600 hover:bg-purple-50 p-2 rounded-full transition-colors"
          title="Planning Tips"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {showTips && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800 space-y-2">
          <p className="font-medium">Planning Tips:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Be specific with your destination for better results</li>
            <li>Select at least 2-3 interests to personalize your itinerary</li>
            <li>Set a realistic budget to get appropriate recommendations</li>
            <li>Longer trips (4+ days) will have more detailed daily plans</li>
          </ul>
          <button
            onClick={() => setShowTips(false)}
            className="text-blue-600 hover:text-blue-800 font-medium text-xs mt-2"
          >
            Got it
          </button>
        </div>
      )}

      {/* Main form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Destination Input */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <PlaneTakeoff className="w-4 h-4 mr-1.5 text-purple-500" />
            Destination
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Where do you want to go?"
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none transition-shadow"
          />
        </div>

        {/* Date Range */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <CalendarDays className="w-4 h-4 mr-1.5 text-purple-500" />
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none transition-shadow"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <CalendarDays className="w-4 h-4 mr-1.5 text-purple-500" />
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none transition-shadow"
          />
        </div>

        {/* Trip length display */}
        {tripLength && (
          <div className="md:col-span-2 flex items-center py-2 px-4 bg-purple-50 rounded-lg border border-purple-100">
            <Clock className="w-4 h-4 text-purple-600 mr-2" />
            <span className="text-sm text-purple-700">
              Trip length:{" "}
              <span className="font-semibold">{tripLength} days</span>
            </span>
          </div>
        )}

        {/* Budget */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <DollarSign className="w-4 h-4 mr-1.5 text-purple-500" />
            Budget
          </label>
          <input
            type="text"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Approximate budget"
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none transition-shadow"
          />
        </div>

        {/* Travelers */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <Users className="w-4 h-4 mr-1.5 text-purple-500" />
            Number of Travelers
          </label>
          <div className="relative flex items-center">
            <button
              onClick={() => setTravelers(Math.max(1, travelers - 1))}
              className="absolute left-0 flex items-center justify-center h-full px-3 text-gray-500 hover:text-purple-600"
              disabled={travelers <= 1}
            >
              <span className="text-xl font-medium">-</span>
            </button>
            <input
              type="number"
              min="1"
              value={travelers}
              onChange={(e) =>
                setTravelers(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none text-center transition-shadow"
            />
            <button
              onClick={() => setTravelers(travelers + 1)}
              className="absolute right-0 flex items-center justify-center h-full px-3 text-gray-500 hover:text-purple-600"
            >
              <span className="text-xl font-medium">+</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interests */}
      <div className="space-y-1.5 pt-2">
        <label className="text-sm font-medium text-gray-700 flex items-center">
          <Compass className="w-4 h-4 mr-1.5 text-purple-500" />
          Interests (Select all that apply)
        </label>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((interest) => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                interests.includes(interest)
                  ? "bg-purple-100 text-purple-700 border border-purple-300 shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent"
              }`}
            >
              {getInterestIcon(interest)}
              <span className="ml-1.5">{interest}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading || !destination}
        className="w-full p-3.5 mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex justify-center items-center space-x-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Creating your perfect itinerary...</span>
          </>
        ) : (
          <>
            <BrainCircuit className="w-5 h-5" />
            <span>Generate AI Trip Plan</span>
          </>
        )}
      </button>

      {/* Saved Plans */}
      {savedPlans.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <ListChecks className="w-4 h-4 mr-1.5 text-purple-500" />
            Your Saved Plans
          </h5>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {savedPlans.map((savedPlan) => (
              <div
                key={savedPlan.id}
                onClick={() => loadSavedPlan(savedPlan.id)}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center transition-colors hover:border-purple-200 group"
              >
                <div className="flex items-center">
                  <div className="bg-purple-100 text-purple-600 w-10 h-10 rounded-full flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 group-hover:text-purple-700 transition-colors">
                      {savedPlan.destination}
                    </p>
                    <p className="text-xs text-gray-500">
                      {savedPlan.startDate
                        ? new Date(savedPlan.startDate).toLocaleDateString()
                        : "No date"}
                      {savedPlan.endDate &&
                        ` to ${new Date(
                          savedPlan.endDate
                        ).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full mr-2 hidden sm:block">
                    {savedPlan.interests.length
                      ? savedPlan.interests[0]
                      : "General"}
                  </span>
                  <button
                    onClick={(e) => deleteSavedPlan(savedPlan.id, e)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                    title="Delete plan"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderPlan = () => (
    <div className="space-y-4">
      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="font-semibold text-gray-800 text-lg flex items-center">
              <Globe className="w-5 h-5 mr-2 text-purple-500" />
              {destination} Trip Plan
            </h4>
            <p className="text-gray-500 text-sm mt-1">
              {startDate && endDate ? (
                <>
                  {new Date(startDate).toLocaleDateString()} -{" "}
                  {new Date(endDate).toLocaleDateString()}· {travelers}{" "}
                  {travelers === 1 ? "traveler" : "travelers"}
                </>
              ) : (
                "Custom itinerary"
              )}
            </p>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveView("form")}
              className="p-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium flex items-center"
            >
              <span className="hidden sm:inline mr-1">Edit</span> Plan
            </button>
            <button
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Download plan"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Share plan"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="Send to chat"
              onClick={() =>
                handleSendToChatBox(
                  `Here's my AI generated trip plan for ${destination}:\n\n${plan.summary}`
                )
              }
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
          <h5 className="font-medium text-blue-800 mb-2">Trip Summary</h5>
          <p className="text-sm text-blue-700">{plan.summary}</p>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b bg-white rounded-t-lg shadow-sm">
        <button
          className={`py-3 px-4 text-sm font-medium flex items-center ${
            activeView === "plan"
              ? "border-b-2 border-purple-500 text-purple-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveView("plan")}
        >
          <ListChecks className="w-4 h-4 mr-1.5" />
          Itinerary
        </button>
        <button
          className={`py-3 px-4 text-sm font-medium flex items-center ${
            activeView === "map"
              ? "border-b-2 border-purple-500 text-purple-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveView("map")}
        >
          <Map className="w-4 h-4 mr-1.5" />
          Map View
        </button>
      </div>

      <div className="space-y-4">
        {plan.days.map((day, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <button
              className={`w-full p-4 flex justify-between items-center transition-colors ${
                expandedDay === index
                  ? "bg-purple-50"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => toggleDayExpansion(index)}
            >
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    expandedDay === index
                      ? "bg-purple-100 text-purple-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <span className="font-medium">{index + 1}</span>
                </div>
                <div className="text-left">
                  <span className="font-medium text-gray-800">
                    Day {index + 1}
                  </span>
                  <p className="text-gray-600 text-sm">{day.title}</p>
                </div>
              </div>
              {expandedDay === index ? (
                <ChevronUp className="w-5 h-5 text-purple-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedDay === index && (
              <div className="p-4 border-t">
                <p className="text-sm text-gray-600 mb-6 bg-gray-50 p-3 rounded-lg">
                  {day.description}
                </p>

                <div className="space-y-6">
                  {day.activities.map((activity, actIndex) => (
                    <div key={actIndex} className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center border border-purple-200 text-purple-600 font-medium shadow-sm">
                          {actIndex + 1}
                        </div>
                        {actIndex < day.activities.length - 1 && (
                          <div className="w-0.5 h-full bg-purple-100 mt-1"></div>
                        )}
                      </div>
                      <div className="flex-1 -mt-1">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {activity.time}
                          </span>
                          <div className="w-1 h-1 bg-gray-300 rounded-full mx-2 hidden sm:block"></div>
                          <span className="text-purple-700 font-medium">
                            {activity.title}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {activity.description}
                        </p>

                        <div className="flex flex-wrap gap-3 mt-3">
                          {activity.location && (
                            <div className="flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                              <Pin className="w-3 h-3 mr-1 text-gray-400" />
                              <span className="truncate max-w-xs">
                                {activity.location}
                              </span>
                            </div>
                          )}

                          {activity.cost && (
                            <div className="flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                              <DollarSign className="w-3 h-3 mr-1 text-gray-400" />
                              <span>{activity.cost}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex mt-3">
                          <button
                            className="text-xs py-1.5 px-3 rounded border border-purple-200 hover:bg-purple-50 flex items-center transition-colors text-purple-600"
                            onClick={() =>
                              handleSendToChatBox(
                                `I'd like to discuss this activity from our trip plan:\n\n${activity.title} - ${activity.description}`
                              )
                            }
                          >
                            <Send className="w-3 h-3 mr-1.5" /> Ask AI About
                            This
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {day.accommodation && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <h6 className="font-medium flex items-center text-blue-800">
                      <Hotel className="w-4 h-4 mr-2" /> Accommodation
                    </h6>
                    <p className="text-sm font-medium text-blue-700 mt-2">
                      {day.accommodation.name}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {day.accommodation.address}
                    </p>
                    {day.accommodation.notes && (
                      <p className="text-xs text-blue-600 mt-2 bg-white/50 p-2 rounded">
                        {day.accommodation.notes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderMapView = () => (
    <div className="text-center py-12 px-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 inline-block">
        <Globe className="w-20 h-20 mx-auto text-purple-300" />
        <p className="mt-4 text-gray-600">
          Interactive map view would display your itinerary locations here
        </p>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => setActiveView("plan")}
            className="px-4 py-2 text-sm text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
          >
            Return to Itinerary
          </button>
          <button className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Open in Google Maps
          </button>
        </div>
      </div>
    </div>
  );

  const getInterestIcon = (interest) => {
    switch (interest) {
      case "Adventure":
        return <Compass className="w-3 h-3 inline" />;
      case "Beach":
        return <Sun className="w-3 h-3 inline" />;
      case "Culture":
        return <Globe className="w-3 h-3 inline" />;
      case "Food":
        return <Utensils className="w-3 h-3 inline" />;
      case "History":
        return <Clock className="w-3 h-3 inline" />;
      case "Nature":
        return <Camera className="w-3 h-3 inline" />;
      case "Nightlife":
        return <Moon className="w-3 h-3 inline" />;
      case "Relaxation":
        return <Coffee className="w-3 h-3 inline" />;
      case "Shopping":
        return <DollarSign className="w-3 h-3 inline" />;
      case "Sports":
        return <Star className="w-3 h-3 inline" />;
      default:
        return <Heart className="w-3 h-3 inline" />;
    }
  };

  return (
    <div className="p-4 space-y-6 bg-gray-50 rounded-xl">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800 flex items-center text-xl">
          <BrainCircuit className="w-6 h-6 mr-2 text-purple-500" />
          AI Trip Planner
        </h3>
        {plan && activeView !== "form" && (
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveView("form")}
              className="py-1 px-3 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
            >
              Edit Details
            </button>
          </div>
        )}
      </div>

      {activeView === "form" && renderForm()}
      {activeView === "plan" && plan && renderPlan()}
      {activeView === "map" && renderMapView()}
    </div>
  );
};

// Function to generate mock trip plan data
const generateMockPlan = (destination, startDate, endDate, budget, travelers, interests) => {
  const destinations = {
    "paris": {
      summary: `A 3-day exploration of Paris, the City of Light, focused on iconic landmarks, world-class museums, and culinary experiences. This plan balances must-see attractions with authentic local experiences, allowing you to enjoy both famous sites and hidden gems.`,
      days: [
        {
          title: "Classic Paris Landmarks",
          description: "Begin your Paris adventure with iconic landmarks and classic Parisian experiences.",
          activities: [
            {
              time: "09:00 AM",
              title: "Eiffel Tower Visit",
              description: "Start your day with a visit to Paris's most iconic landmark. Consider going early to avoid crowds and enjoy breathtaking views of the city.",
              location: "Champ de Mars, 5 Avenue Anatole France",
              cost: "€26-€60 depending on how high you go and if you take the elevator"
            },
            {
              time: "12:00 PM",
              title: "Lunch at Café Constant",
              description: "Enjoy authentic French cuisine at this charming bistro near the Eiffel Tower, known for traditional dishes with a modern twist.",
              location: "139 Rue Saint-Dominique",
              cost: "€20-€35 per person"
            },
            {
              time: "02:00 PM",
              title: "Arc de Triomphe & Champs-Élysées",
              description: "Visit the magnificent Arc de Triomphe and stroll down the famous Champs-Élysées avenue for shopping and people-watching.",
              location: "Place Charles de Gaulle",
              cost: "€13 for Arc de Triomphe access"
            },
            {
              time: "04:30 PM",
              title: "Seine River Cruise",
              description: "Take a relaxing boat tour along the Seine River to see Paris from a different perspective.",
              location: "Bateaux Parisiens, Port de la Bourdonnais",
              cost: "€15-€20 per person"
            },
            {
              time: "07:00 PM",
              title: "Dinner in Le Marais",
              description: "Explore the trendy Le Marais neighborhood and enjoy dinner at a local restaurant.",
              location: "Le Marais district",
              cost: "€30-€50 per person"
            }
          ],
          accommodation: {
            name: "Hotel des Arts Montmartre",
            address: "5 Rue Tholozé, 75018 Paris",
            notes: "Charming boutique hotel in the artistic Montmartre neighborhood"
          }
        },
        {
          title: "Museums and Cultural Immersion",
          description: "Dedicate your second day to Paris's world-class museums and cultural experiences.",
          activities: [
            {
              time: "09:00 AM",
              title: "Louvre Museum",
              description: "Spend the morning at the world's largest art museum, home to thousands of works including the Mona Lisa and Venus de Milo.",
              location: "Rue de Rivoli, 75001 Paris",
              cost: "€17 per person"
            },
            {
              time: "01:00 PM",
              title: "Lunch at Café Marly",
              description: "Enjoy lunch with a view of the Louvre's pyramid at this elegant café.",
              location: "93 Rue de Rivoli, inside the Louvre",
              cost: "€25-€40 per person"
            },
            {
              time: "03:00 PM",
              title: "Musée d'Orsay",
              description: "Visit this magnificent museum housed in a former railway station, featuring impressionist masterpieces.",
              location: "1 Rue de la Légion d'Honneur",
              cost: "€16 per person"
            },
            {
              time: "06:00 PM",
              title: "Saint-Germain-des-Prés Exploration",
              description: "Wander through this historic intellectual hub of Paris with its famous cafés and bookshops.",
              location: "Saint-Germain-des-Prés neighborhood",
              cost: "Free for walking, €5-€10 for coffee at historic cafés"
            },
            {
              time: "08:00 PM",
              title: "Dinner at a Traditional Bistro",
              description: "Experience authentic French cuisine at a traditional Parisian bistro.",
              location: "Bistrot Paul Bert, 18 Rue Paul Bert",
              cost: "€35-€50 per person"
            }
          ],
          accommodation: {
            name: "Hotel des Arts Montmartre",
            address: "5 Rue Tholozé, 75018 Paris",
            notes: "Same hotel as previous night"
          }
        },
        {
          title: "Hidden Gems and Parisian Atmosphere",
          description: "On your final day, discover lesser-known spots and experience authentic Parisian life.",
          activities: [
            {
              time: "09:00 AM",
              title: "Montmartre and Sacré-Cœur",
              description: "Explore the artistic neighborhood of Montmartre and visit the beautiful Sacré-Cœur Basilica with panoramic views of Paris.",
              location: "Montmartre hill, 75018 Paris",
              cost: "Free for Sacré-Cœur, €12 for Montmartre Museum"
            },
            {
              time: "12:00 PM",
              title: "Lunch at La Maison Rose",
              description: "Have lunch at this picturesque pink house café, a favorite spot for artists throughout history.",
              location: "2 Rue de l'Abreuvoir",
              cost: "€20-€30 per person"
            },
            {
              time: "02:00 PM",
              title: "Notre-Dame Cathedral (Exterior)",
              description: "Visit the exterior of the iconic Notre-Dame Cathedral (interior closed for restoration) and explore the charming Île de la Cité.",
              location: "Île de la Cité",
              cost: "Free"
            },
            {
              time: "04:00 PM",
              title: "Latin Quarter Exploration",
              description: "Wander through the historic Latin Quarter with its narrow streets, bookshops, and cafés.",
              location: "5th Arrondissement",
              cost: "Free for walking"
            },
            {
              time: "07:00 PM",
              title: "Farewell Dinner with Seine View",
              description: "Enjoy your final Parisian dinner at a restaurant with views of the Seine River.",
              location: "Les Ombres, 27 Quai Branly",
              cost: "€50-€80 per person"
            }
          ],
          accommodation: {
            name: "Hotel des Arts Montmartre",
            address: "5 Rue Tholozé, 75018 Paris",
            notes: "Final night in Paris"
          }
        }
      ]
    }
}
}
export default AITrip