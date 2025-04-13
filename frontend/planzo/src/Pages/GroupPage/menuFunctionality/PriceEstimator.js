import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Calculator,
  DollarSign,
  ArrowRight,
  Building,
  Map,
  Utensils,
  Activity,
  Bus,
  Calendar,
  Users,
  Bookmark,
  Star,
  Clock,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const CostEstimator = ({  onSaved }) => {
  const [step, setStep] = useState("category");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [estimate, setEstimate] = useState(null);
  const [savedEstimates, setSavedEstimates] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const {chatId} = useParams()
  const { getAccessTokenSilently } = useAuth0();
  
  const [formData, setFormData] = useState({
    city: "",
    category: "",
    numPeople: 1,
    duration: 3,
    quality: "standard", // budget, standard, premium
    details: {},
    additionalInfo: "",
  });

  const categories = [
    {
      id: "accommodation",
      label: "Accommodation",
      icon: <Building size={20} />,
    },
    { id: "food", label: "Food & Dining", icon: <Utensils size={20} /> },
    { id: "activities", label: "Activities", icon: <Activity size={20} /> },
    { id: "transportation", label: "Transportation", icon: <Bus size={20} /> },
    { id: "daily", label: "Daily Expenses", icon: <Calendar size={20} /> },
  ];

  useEffect(() => {
    // Fetch saved estimates when component loads
    if (chatId) {
      fetchSavedEstimates();
    }
  }, [chatId]);

  const fetchSavedEstimates = async () => {
    const token = await getAccessTokenSilently();
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/chats/${chatId}/cost-estimates`,
        {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSavedEstimates(response.data);
    } catch (error) {
      console.error("Error fetching saved estimates:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("details.")) {
      const detailKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        details: {
          ...prev.details,
          [detailKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const goToStep = (nextStep) => {
    setStep(nextStep);
    setError(null);
  };

  const handleCategorySelect = (categoryId) => {
    setFormData((prev) => ({ ...prev, category: categoryId }));
    goToStep("details");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = await getAccessTokenSilently();

    try {
      
      const response = await axios.post(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        }/chats/${chatId}/cost-estimate`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setEstimate(response.data.estimate);
      goToStep("results");
      // Refresh saved estimates
      fetchSavedEstimates();
      if (onSaved) onSaved(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to generate estimate. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      city: "",
      category: "",
      numPeople: 1,
      duration: 3,
      quality: "standard",
      details: {},
      additionalInfo: "",
    });
    setEstimate(null);
    goToStep("category");
  };

  const renderCategoryOptions = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        What would you like to estimate?
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.id)}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center justify-center shadow-sm"
          >
            <span className="text-blue-600 mb-2">{cat.icon}</span>
            <span className="font-medium text-gray-800">{cat.label}</span>
          </button>
        ))}
      </div>

      {savedEstimates.length > 0 && (
        <button
          onClick={() => setShowSaved(true)}
          className="w-full mt-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 flex items-center justify-center"
        >
          <Bookmark size={16} className="mr-2" />
          View Saved Estimates ({savedEstimates.length})
        </button>
      )}
    </div>
  );

  const renderDetailsForm = () => {
    const selectedCategory = categories.find((c) => c.id === formData.category);

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <span className="text-blue-600 mr-2">{selectedCategory?.icon}</span>
            {selectedCategory?.label} Cost Estimate
          </h3>
          <button
            type="button"
            onClick={() => goToStep("category")}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <ArrowLeft size={14} className="mr-1" /> Change
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="e.g. Paris, Tokyo, New York"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of People
              </label>
              <input
                type="number"
                name="numPeople"
                value={formData.numPeople}
                onChange={handleInputChange}
                min="1"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {formData.category !== "activities" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.category === "accommodation" ? "Nights" : "Days"}
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quality Preference
            </label>
            <select
              name="quality"
              value={formData.quality}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="budget">Budget/Economy</option>
              <option value="standard">Standard/Mid-range</option>
              <option value="premium">Premium/Luxury</option>
            </select>
          </div>

          {/* Conditional fields based on category */}
          {formData.category === "accommodation" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Accommodation Type
              </label>
              <select
                name="details.type"
                value={formData.details.type || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any type</option>
                <option value="hostel">Hostel/Dormitory</option>
                <option value="apartment">Apartment/Airbnb</option>
                <option value="hotel">Hotel</option>
                <option value="resort">Resort/Luxury Hotel</option>
              </select>
            </div>
          )}

          {formData.category === "food" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meals Per Day
              </label>
              <select
                name="details.mealsPerDay"
                value={formData.details.mealsPerDay || "3"}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="2">2 (breakfast & dinner)</option>
                <option value="3">3 (breakfast, lunch & dinner)</option>
                <option value="4">4+ (including snacks/coffee)</option>
              </select>
            </div>
          )}

          {formData.category === "activities" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activity Types
              </label>
              <select
                name="details.activityType"
                value={formData.details.activityType || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All activities</option>
                <option value="sightseeing">Sightseeing & Tours</option>
                <option value="cultural">Museums & Cultural</option>
                <option value="adventure">Adventure & Outdoor</option>
                <option value="entertainment">Entertainment & Shows</option>
              </select>
            </div>
          )}

          {formData.category === "transportation" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transportation Type
              </label>
              <select
                name="details.transportType"
                value={formData.details.transportType || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All types</option>
                <option value="public">Public Transportation</option>
                <option value="taxi">Taxis & Rideshares</option>
                <option value="rental">Car Rental</option>
                <option value="tour">Tour Buses & Transfers</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Information (Optional)
            </label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              placeholder="Any specific requirements or details..."
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start">
            <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !formData.city}
          className={`w-full p-3 flex items-center justify-center space-x-2 rounded-lg ${
            loading || !formData.city
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generating Estimate...</span>
            </>
          ) : (
            <>
              <Calculator className="w-4 h-4" />
              <span>Generate AI Cost Estimate</span>
            </>
          )}
        </button>
      </form>
    );
  };

  const renderSavedEstimates = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Saved Estimates</h3>
        <button
          onClick={() => setShowSaved(false)}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          <ArrowLeft size={14} className="mr-1" /> Back
        </button>
      </div>

      {savedEstimates.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No saved estimates found
        </p>
      ) : (
        <div className="space-y-3">
          {savedEstimates.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 cursor-pointer"
              onClick={() => {
                setEstimate(item.estimate);
                setFormData({
                  city: item.city,
                  category: item.category,
                  ...item.details,
                });
                goToStep("results");
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{item.city}</span>
                <span className="text-xs text-gray-500">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-blue-600 mr-2">
                  {categories.find((c) => c.id === item.category)?.icon}
                </span>
                <span>
                  {categories.find((c) => c.id === item.category)?.label}
                </span>
                <span className="text-green-600 font-medium ml-auto">
                  ${item.estimate.totalEstimatedCost}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setShowSaved(false)}
        className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
      >
        Create New Estimate
      </button>
    </div>
  );

  const renderResults = () => {
    if (!estimate) return null;

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Cost Estimate Results</h3>
          <button
            onClick={resetForm}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            New Estimate
          </button>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="text-center mb-4">
            <span className="text-blue-800 font-medium">{formData.city}</span>
            <div className="text-sm text-gray-600">
              {formData.category === "daily"
                ? "Daily expenses"
                : categories.find((c) => c.id === formData.category)
                    ?.label}{" "}
              for {formData.numPeople}{" "}
              {formData.numPeople === 1 ? "person" : "people"}
              {formData.category !== "activities" &&
                ` • ${formData.duration} ${
                  formData.category === "accommodation" ? "nights" : "days"
                }`}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white p-3 rounded border text-center">
              <p className="text-xs text-gray-500">Budget</p>
              <p className="text-lg font-semibold text-green-600">
                ${estimate.low.amount}
              </p>
              <p className="text-xs text-gray-600 line-clamp-2">
                {estimate.low.description}
              </p>
            </div>
            <div className="bg-white p-3 rounded border text-center shadow-md">
              <p className="text-xs text-gray-500">Standard</p>
              <p className="text-xl font-semibold text-blue-600">
                ${estimate.medium.amount}
              </p>
              <p className="text-xs text-gray-600 line-clamp-2">
                {estimate.medium.description}
              </p>
            </div>
            <div className="bg-white p-3 rounded border text-center">
              <p className="text-xs text-gray-500">Premium</p>
              <p className="text-lg font-semibold text-purple-600">
                ${estimate.high.amount}
              </p>
              <p className="text-xs text-gray-600 line-clamp-2">
                {estimate.high.description}
              </p>
            </div>
          </div>

          <div className="bg-white p-3 rounded border mb-3">
            <h4 className="font-medium text-gray-800 mb-2">Cost Breakdown</h4>
            <div className="space-y-2">
              {estimate.breakdown.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{item.item}</span>
                  <span className="font-medium">
                    ${item.lowCost} - ${item.highCost}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded border overflow-hidden">
            <div className="p-3 bg-blue-50 border-b font-medium text-gray-800">
              Money-Saving Tips
            </div>
            <div className="p-3">
              <ul className="text-sm space-y-1">
                {estimate.tips.map((tip, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center bg-gray-100 p-3 rounded border">
            <div>
              <div className="text-sm text-gray-600">Total Estimate</div>
              <div className="font-bold text-lg">
                ${estimate.totalEstimatedCost}
              </div>
            </div>
            {estimate.perPersonPerDay && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Per Person/Day</div>
                <div className="font-medium">${estimate.perPersonPerDay}</div>
              </div>
            )}
          </div>
        </div>

        <div className="text-xs text-gray-500">
          <p>
            * Estimates are based on current market rates and may vary by
            season.
          </p>
          <p>
            * Prices may differ based on specific preferences and market
            fluctuations.
          </p>
        </div>
      </div>
    );
  };

  // Main render logic
  return (
    <div className="bg-white rounded-lg border p-4 w-full max-w-lg mx-auto">
      {showSaved
        ? renderSavedEstimates()
        : step === "category"
        ? renderCategoryOptions()
        : step === "details"
        ? renderDetailsForm()
        : renderResults()}
    </div>
  );
};

export default CostEstimator;
