import React, { useState } from "react";
import {
  Plane,
  Users,
  Calendar,
  DollarSign,
  Star,
  Loader2,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function AiTripPlanner({ onPlanGenerated }) {
  
  const [currentDestination, setCurrentDestination] = useState("");
  const {chatId} = useParams()
  const { getAccessTokenSilently } = useAuth0();

  const [formData, setFormData] = useState({
    destinations: [],
    numDays: 1,
    budget: 1000,
    numMembers: 1,  
    quality: "standard",
  }); 
  const [loading, setLoading] = useState(false);


  const handleAddDestination = () => {
    if (currentDestination.trim()) {
      setFormData((prev) => ({
        ...prev,
        destinations: [...prev.destinations, currentDestination.trim()],
      }));
      setCurrentDestination("");
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
            Authorization: `Bearer ${token}`, // 🔐 Include the token here
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">AI Trip Planner</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destinations
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={currentDestination}
              onChange={(e) => setCurrentDestination(e.target.value)}
              placeholder="Enter a destination"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddDestination}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.destinations.map((dest, index) => (
              <div
                key={index}
                className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
              >
                <Plane className="w-4 h-4" />
                <span>{dest}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveDestination(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline-block mr-2" />
              Number of Days
            </label>
            <input
              type="number"
              min="1"
              value={formData.numDays}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  numDays: parseInt(e.target.value),
                }))
              }
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline-block mr-2" />
              Budget (USD)
            </label>
            <input
              type="number"
              min="100"
              value={formData.budget}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  budget: parseInt(e.target.value),
                }))
              }
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline-block mr-2" />
              Number of Members
            </label>
            <input
              type="number"
              min="1"
              value={formData.numMembers}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  numMembers: parseInt(e.target.value),
                }))
              }
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Star className="w-4 h-4 inline-block mr-2" />
              Trip Quality
            </label>
            <select
              value={formData.quality}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, quality: e.target.value }))
              }
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="budget">Budget Friendly</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || formData.destinations.length === 0}
          className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Trip Plan...
            </>
          ) : (
            "Generate Trip Plan"
          )}
        </button>
      </form>
    </div>
  );
}
