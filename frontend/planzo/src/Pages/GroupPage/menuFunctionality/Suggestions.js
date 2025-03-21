import React, { useState, useEffect } from "react";
import {
  MapPin,
  ThermometerSun,
  LifeBuoy,
  Calendar,
  Wallet,
  DollarSign,
  Clock,
  Utensils,
  Activity,
  CheckCircle2,
  Send,
  Lightbulb
} from "lucide-react";

const Suggestions = ({ destination }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [customDestination, setCustomDestination] = useState(destination || "");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock suggestion categories
  const categories = [
    { id: "all", label: "All" },
    { id: "attractions", label: "Attractions" },
    { id: "safety", label: "Safety" },
    { id: "budget", label: "Budget" },
    { id: "food", label: "Food" },
    { id: "activities", label: "Activities" },
  ];

  // Generate suggestions based on destination
  useEffect(() => {
    if (destination || customDestination) {
      generateSuggestions(destination || customDestination);
    }
  }, [destination]);

  const generateSuggestions = (dest) => {
    setLoading(true);

    // Mock API call - in a real app, this would be an actual API call
    setTimeout(() => {
      const mockSuggestions = [
        {
          id: 1,
          category: "attractions",
          text: `Visit ${dest}'s most popular attractions early in the morning to avoid crowds`,
          icon: MapPin,
        },
        {
          id: 2,
          category: "attractions",
          text: `Consider the ${dest} City Pass to save on multiple attractions`,
          icon: DollarSign,
        },
        {
          id: 3,
          category: "safety",
          text: `Research local emergency numbers in ${dest} before your trip`,
          icon: LifeBuoy,
        },
        {
          id: 4,
          category: "safety",
          text: `Check travel advisories for ${dest} before booking`,
          icon: LifeBuoy,
        },
        {
          id: 5,
          category: "budget",
          text: `Exchange currency before arriving in ${dest} for better rates`,
          icon: Wallet,
        },
        {
          id: 6,
          category: "budget",
          text: `Consider using public transportation in ${dest} to save money`,
          icon: DollarSign,
        },
        {
          id: 7,
          category: "food",
          text: `Try local street food in ${dest} for authentic experiences`,
          icon: Utensils,
        },
        {
          id: 8,
          category: "activities",
          text: `Book outdoor activities in ${dest} in advance to secure spots`,
          icon: Activity,
        },
        {
          id: 9,
          category: "safety",
          text: `Pack weather-appropriate clothing for ${dest}'s climate`,
          icon: ThermometerSun,
        },
        {
          id: 10,
          category: "activities",
          text: `Look for free walking tours in ${dest} to learn about local history`,
          icon: Activity,
        },
      ];

      setSuggestions(mockSuggestions);
      setLoading(false);
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (customDestination.trim()) {
      generateSuggestions(customDestination);
    }
  };

  const handleSendToChat = (suggestion) => {
    // This would integrate with your chat system to send the suggestion
    console.log("Sending to chat:", suggestion);
    // You could use a function passed from props to actually send it
    // sendMessageToChat(suggestion.text);
  };

  const filteredSuggestions =
    selectedCategory === "all"
      ? suggestions
      : suggestions.filter((s) => s.category === selectedCategory);

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-gray-800 flex items-center">
        <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
        Travel Suggestions
      </h3>

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={customDestination}
          onChange={(e) => setCustomDestination(e.target.value)}
          placeholder="Enter destination"
          className="flex-1 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />
        <button
          type="submit"
          className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
          disabled={loading || !customDestination.trim()}
        >
          Get Tips
        </button>
      </form>

      <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${
              selectedCategory === category.id
                ? "bg-purple-100 text-purple-700 border border-purple-300"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSuggestions.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              {customDestination
                ? `No suggestions available for ${customDestination}. Try another destination.`
                : "Enter a destination to get travel suggestions"}
            </div>
          ) : (
            filteredSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start">
                  <div className="p-2 bg-purple-100 rounded-full mr-3">
                    <suggestion.icon className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{suggestion.text}</p>
                  </div>
                  <button
                    onClick={() => handleSendToChat(suggestion)}
                    className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                    title="Send to chat"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Suggestions;
