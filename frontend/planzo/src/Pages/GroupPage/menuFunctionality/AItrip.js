import React, { useState } from "react";
import {
  Plane,
  Users,
  Calendar,
  DollarSign,
  Star,
  Loader2,
  Plus,
  X,
  MapPin,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function AiTripPlanner({ onPlanGenerated }) {
  const [currentDestination, setCurrentDestination] = useState("");
  const { chatId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [expanded, setExpanded] = useState(true);

  const [formData, setFormData] = useState({
    destinations: [],
    numDays: 5,
    budget: 2000,
    numMembers: 2,
    quality: "standard",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddDestination = () => {
    if (currentDestination.trim()) {
      setFormData((prev) => ({
        ...prev,
        destinations: [...prev.destinations, currentDestination.trim()],
      }));
      setCurrentDestination("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddDestination();
    }
  };

  const handleRemoveDestination = (index) => {
    setFormData((prev) => ({
      ...prev,
      destinations: prev.destinations.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = await getAccessTokenSilently();
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/chats/${chatId}/ai-trip`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate trip plan");
      }

      const data = await response.json();
      onPlanGenerated(data);
    } catch (error) {
      console.error("Error generating trip plan:", error);
      setError("Failed to generate trip plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const qualityOptions = [
    {
      value: "budget",
      label: "Budget Friendly",
      description: "Economical options to maximize value",
    },
    {
      value: "standard",
      label: "Standard",
      description: "Balanced quality and price",
    },
    {
      value: "premium",
      label: "Premium",
      description: "Luxury experience with premium amenities",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div
        className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Sparkles className="w-6 h-6" />
          AI Trip Planner
        </h2>
        <button className="text-white hover:bg-white/20 p-2 rounded-full transition-all">
          {expanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      {expanded && (
        <div className="p-6 space-y-8">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-lg">
                Where do you want to go?
              </label>
              <div className="relative flex items-center mb-4">
                <div className="absolute left-3 text-gray-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={currentDestination}
                  onChange={(e) => setCurrentDestination(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter a destination"
                  className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-12"
                />
                <button
                  type="button"
                  onClick={handleAddDestination}
                  className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {formData.destinations.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.destinations.map((dest, index) => (
                    <div
                      key={index}
                      className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-indigo-200 transition-colors"
                    >
                      <Plane className="w-4 h-4" />
                      <span className="font-medium">{dest}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDestination(index)}
                        className="bg-white text-gray-500 rounded-full p-1 hover:bg-gray-100 hover:text-red-500 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic mb-2">
                  Add at least one destination to continue
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <Calendar className="w-4 h-4 inline-block mr-2 text-indigo-600" />
                    Trip Duration
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={formData.numDays}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          numDays: parseInt(e.target.value),
                        }))
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="absolute -top-10 left-0 right-0 flex justify-center">
                      <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg">
                        {formData.numDays} day
                        {formData.numDays !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <Users className="w-4 h-4 inline-block mr-2 text-indigo-600" />
                    Number of Travelers
                  </label>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          numMembers: Math.max(1, prev.numMembers - 1),
                        }))
                      }
                      className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                      disabled={formData.numMembers <= 1}
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-medium text-indigo-700">
                      {formData.numMembers}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          numMembers: prev.numMembers + 1,
                        }))
                      }
                      className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <DollarSign className="w-4 h-4 inline-block mr-2 text-indigo-600" />
                    Budget (USD)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      min="100"
                      step="100"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          budget: parseInt(e.target.value),
                        }))
                      }
                      className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <Star className="w-4 h-4 inline-block mr-2 text-indigo-600" />
                    Trip Quality
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {qualityOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            quality: option.value,
                          }))
                        }
                        className={`p-3 rounded-lg text-center transition-all ${
                          formData.quality === option.value
                            ? "bg-indigo-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <div className="font-medium">{option.label}</div>
                        <div
                          className={`text-xs mt-1 ${
                            formData.quality === option.value
                              ? "text-indigo-100"
                              : "text-gray-500"
                          }`}
                        >
                          {option.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || formData.destinations.length === 0}
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-indigo-200 font-bold text-lg transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Creating Your Perfect Trip...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Generate AI Trip Plan
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
