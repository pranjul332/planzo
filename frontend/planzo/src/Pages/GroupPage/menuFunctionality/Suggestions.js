import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MapPin,
  ThermometerSun,
  ShieldAlert,
  UtensilsCrossed,
  Landmark,
  Ticket,
  Coins,
  Clock,
  Calendar,
  Languages,
  Bus,
  Send,
  Loader2,
  ChevronRight,
  PlusCircle,
  XCircle,
  AlertCircle,
  Star,
} from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from "react-router-dom";

const categoryIcons = {
  weather: ThermometerSun,
  safety: ShieldAlert,
  food: UtensilsCrossed,
  attractions: Landmark,
  activities: Ticket,
  budget: Coins,
  schedule: Clock,
  events: Calendar,
  culture: Languages,
  transportation: Bus,
};

const defaultCategories = [
  { id: "weather", label: "Weather & Best Time", icon: ThermometerSun },
  { id: "safety", label: "Safety Tips", icon: ShieldAlert },
  { id: "food", label: "Food & Cuisine", icon: UtensilsCrossed },
  { id: "attractions", label: "Must-Visit Places", icon: Landmark },
  { id: "activities", label: "Activities", icon: Ticket },
  { id: "budget", label: "Budget Tips", icon: Coins },
  { id: "schedule", label: "Daily Schedule", icon: Clock },
  { id: "events", label: "Events & Festivals", icon: Calendar },
  { id: "culture", label: "Culture & Customs", icon: Languages },
  { id: "transportation", label: "Getting Around", icon: Bus },
];

const TripSuggestions = () => {
  const [city, setCity] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [error, setError] = useState(null);
  const [searchCity, setSearchCity] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({});
  const {chatId} = useParams()
  const { getAccessTokenSilently } = useAuth0();

  const toggleCategory = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const toggleExpandCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const fetchSavedSuggestions = async (cityName) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `/api/chats/${chatId}/ai-suggestions/${cityName}`
      );
      setSuggestions(response.data);
      setCity(cityName);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // If no saved suggestions, don't show an error, just clear results
        setSuggestions(null);
      } else {
        setError("Error fetching saved suggestions. Please try again.");
        console.error("Error fetching saved suggestions:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchSavedSuggestions(searchCity);
    }
  };

  const generateSuggestions = async () => {
    if (!city.trim() || selectedCategories.length === 0) {
      setError("Please enter a city and select at least one category");
      return;
    }

    setLoading(true);
    setError(null);
     const token = await getAccessTokenSilently();

    try {
      const response = await axios.post(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/chats/${chatId}/ai-suggestions`,
        {
          city: city,
          categories: selectedCategories,
        },
        {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuggestions(response.data);

      // Automatically expand all categories
      const newExpandedState = {};
      response.data.suggestions.forEach((cat) => {
        newExpandedState[cat.category] = true;
      });
      setExpandedCategories(newExpandedState);

      // Reset selected categories after successful generation
      setSelectedCategories([]);
    } catch (err) {
      setError("Failed to generate suggestions. Please try again.");
      console.error("Error generating suggestions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendToChat = (suggestion, item) => {
    // This would integrate with your chat system
    console.log("Sending to chat:", item);
    // Implementation would depend on your chat component structure
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <MapPin className="w-5 h-5 mr-2 text-purple-600" />
        AI Travel Suggestions
      </h3>

      {/* Search for existing suggestions */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Find saved suggestions
        </h4>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            placeholder="Search city..."
            className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={!searchCity.trim() || loading}
            className="px-3 py-2 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </button>
        </form>
      </div>

      {/* Create new suggestions */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Generate new suggestions
        </h4>

        <div className="space-y-3">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Select suggestion categories:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {defaultCategories.map((category) => {
                const CategoryIcon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className={`flex items-center p-2 border rounded-md text-xs ${
                      selectedCategories.includes(category.id)
                        ? "bg-purple-100 border-purple-400 text-purple-700"
                        : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <CategoryIcon className="w-3 h-3 mr-1" />
                    <span className="truncate">{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={generateSuggestions}
              disabled={
                !city.trim() || selectedCategories.length === 0 || loading
              }
              className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:bg-purple-300"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <PlusCircle className="w-4 h-4" />
              )}
              Generate Suggestions
            </button>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
          <AlertCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Display suggestions */}
      {suggestions && (
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-3 flex items-center">
            <Star className="w-4 h-4 text-yellow-500 mr-2" />
            Suggestions for {suggestions.city}
          </h4>

          <div className="space-y-3">
            {suggestions.suggestions.map((category, idx) => {
              const CategoryIcon =
                categoryIcons[category.category.toLowerCase()] || MapPin;
              const isExpanded = expandedCategories[category.category] || false;

              return (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-md overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpandCategory(category.category)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <CategoryIcon className="w-4 h-4 text-purple-600 mr-2" />
                      <span className="font-medium text-sm">
                        {category.category}
                      </span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 text-gray-500 transition-transform ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="p-3 space-y-2">
                      {category.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="p-2 border border-gray-100 rounded bg-gray-50"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="text-sm font-medium text-gray-800">
                                {item.title}
                              </h5>
                              <p className="text-xs text-gray-600 mt-1">
                                {item.description}
                              </p>
                            </div>
                            <button
                              onClick={() => handleSendToChat(category, item)}
                              className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors flex-shrink-0"
                              title="Send to chat"
                            >
                              <Send className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripSuggestions;
