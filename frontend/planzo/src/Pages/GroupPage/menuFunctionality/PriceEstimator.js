import React, { useState } from "react";
import { Calculator, DollarSign, ArrowRight } from "lucide-react";

const PriceEstimator = () => {
  const [category, setCategory] = useState("");
  const [formData, setFormData] = useState({
    destination: "",
    duration: "",
    people: 1,
    quality: "standard", // budget, standard, premium
    specifics: "",
  });
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: "travel", label: "Travel", icon: "✈️" },
    { id: "food", label: "Food", icon: "🍽️" },
    { id: "stay", label: "Accommodation", icon: "🏨" },
    { id: "activity", label: "Activities", icon: "🎭" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getFormFields = () => {
    const commonFields = (
      <>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destination
          </label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleInputChange}
            placeholder="e.g. Paris, France"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of People
          </label>
          <input
            type="number"
            name="people"
            value={formData.people}
            onChange={handleInputChange}
            min="1"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </>
    );

    switch (category) {
      case "travel":
        return (
          <>
            {commonFields}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mode of Transport
              </label>
              <select
                name="specifics"
                value={formData.specifics}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select mode</option>
                <option value="flight">Flight</option>
                <option value="train">Train</option>
                <option value="bus">Bus</option>
                <option value="car">Car Rental</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quality
              </label>
              <select
                name="quality"
                value={formData.quality}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="budget">Economy/Budget</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium/First Class</option>
              </select>
            </div>
          </>
        );
      case "food":
        return (
          <>
            {commonFields}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meals per Day
              </label>
              <input
                type="number"
                name="specifics"
                value={formData.specifics}
                onChange={handleInputChange}
                min="1"
                max="6"
                placeholder="e.g. 3"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dining Preference
              </label>
              <select
                name="quality"
                value={formData.quality}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="budget">Street Food/Budget</option>
                <option value="standard">Casual Restaurants</option>
                <option value="premium">Fine Dining</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Days
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="1"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        );
      case "stay":
        return (
          <>
            {commonFields}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Nights
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="1"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Accommodation Type
              </label>
              <select
                name="specifics"
                value={formData.specifics}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select type</option>
                <option value="hostel">Hostel/Backpacker</option>
                <option value="apartment">Apartment/Airbnb</option>
                <option value="hotel">Hotel</option>
                <option value="resort">Resort/Luxury Hotel</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quality
              </label>
              <select
                name="quality"
                value={formData.quality}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="budget">Budget (1-2 stars)</option>
                <option value="standard">Standard (3 stars)</option>
                <option value="premium">Premium (4-5 stars)</option>
              </select>
            </div>
          </>
        );
      case "activity":
        return (
          <>
            {commonFields}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activity Type
              </label>
              <select
                name="specifics"
                value={formData.specifics}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select type</option>
                <option value="sightseeing">Sightseeing/Tours</option>
                <option value="adventure">Adventure/Sports</option>
                <option value="cultural">Cultural/Museums</option>
                <option value="entertainment">Entertainment/Shows</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Activities
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="1"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const calculateEstimate = () => {
    setLoading(true);
    // In a real app, this would call an API
    setTimeout(() => {
      // Simplified price calculation logic
      let basePrice = 0;
      let multiplier = 1;

      switch (category) {
        case "travel":
          basePrice =
            formData.specifics === "flight"
              ? 300
              : formData.specifics === "train"
              ? 100
              : formData.specifics === "bus"
              ? 50
              : 200;
          multiplier =
            formData.quality === "budget"
              ? 0.7
              : formData.quality === "premium"
              ? 2.5
              : 1;
          break;
        case "food":
          basePrice = 30 * parseInt(formData.specifics || 3);
          multiplier =
            formData.quality === "budget"
              ? 0.5
              : formData.quality === "premium"
              ? 3
              : 1;
          basePrice = basePrice * parseInt(formData.duration || 1);
          break;
        case "stay":
          basePrice = 100;
          multiplier =
            formData.specifics === "hostel"
              ? 0.3
              : formData.specifics === "apartment"
              ? 0.8
              : formData.specifics === "resort"
              ? 3
              : 1;
          multiplier *=
            formData.quality === "budget"
              ? 0.7
              : formData.quality === "premium"
              ? 2
              : 1;
          basePrice = basePrice * parseInt(formData.duration || 1);
          break;
        case "activity":
          basePrice = 50;
          multiplier =
            formData.specifics === "sightseeing"
              ? 0.8
              : formData.specifics === "adventure"
              ? 1.5
              : formData.specifics === "cultural"
              ? 0.7
              : formData.specifics === "entertainment"
              ? 2
              : 1;
          basePrice = basePrice * parseInt(formData.duration || 1);
          break;
      }

      // Destination-based adjustment (simplified)
      const expensiveDestinations = [
        "japan",
        "switzerland",
        "norway",
        "new york",
        "paris",
      ];
      const cheapDestinations = [
        "thailand",
        "vietnam",
        "indonesia",
        "mexico",
        "turkey",
      ];

      const dest = formData.destination.toLowerCase();

      if (expensiveDestinations.some((d) => dest.includes(d))) {
        multiplier *= 1.5;
      } else if (cheapDestinations.some((d) => dest.includes(d))) {
        multiplier *= 0.7;
      }

      const finalPrice =
        basePrice * multiplier * parseInt(formData.people || 1);

      setEstimate({
        low: Math.round(finalPrice * 0.8),
        average: Math.round(finalPrice),
        high: Math.round(finalPrice * 1.2),
      });

      setLoading(false);
    }, 800);
  };

  const resetForm = () => {
    setCategory("");
    setFormData({
      destination: "",
      duration: "",
      people: 1,
      quality: "standard",
      specifics: "",
    });
    setEstimate(null);
  };

  if (estimate) {
    return (
      <div className="space-y-6">
        <h3 className="font-semibold text-lg">Estimated Costs</h3>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="text-center mb-4">
            <span className="text-sm text-gray-500">
              Estimated {category} costs for {formData.people}{" "}
              {parseInt(formData.people) === 1 ? "person" : "people"}
            </span>
            <h4 className="font-medium">{formData.destination}</h4>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-white p-3 rounded border text-center">
              <p className="text-xs text-gray-500">Low Estimate</p>
              <p className="text-lg font-semibold text-green-600">
                ${estimate.low}
              </p>
            </div>
            <div className="bg-white p-3 rounded border text-center shadow-md">
              <p className="text-xs text-gray-500">Average</p>
              <p className="text-xl font-semibold text-blue-600">
                ${estimate.average}
              </p>
            </div>
            <div className="bg-white p-3 rounded border text-center">
              <p className="text-xs text-gray-500">High Estimate</p>
              <p className="text-lg font-semibold text-purple-600">
                ${estimate.high}
              </p>
            </div>
          </div>

          <div className="text-xs text-gray-500 mb-4">
            <p>* Estimates are based on current market rates and may vary.</p>
            <p>* Additional fees or seasonal pricing not included.</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={resetForm}
            className="flex-1 p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            New Estimate
          </button>
          <button className="flex-1 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Save to Trip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h3 className="font-semibold text-lg">Price Estimator</h3>

      {!category ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            What would you like to estimate?
          </p>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-center shadow-sm"
              >
                <span className="text-2xl block mb-2">{cat.icon}</span>
                <span className="font-medium text-gray-800">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center">
              <span className="mr-2">
                {categories.find((c) => c.id === category)?.icon}
              </span>
              {categories.find((c) => c.id === category)?.label} Estimate
            </h4>
            <button
              onClick={() => setCategory("")}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Change
            </button>
          </div>

          <div className="space-y-1">{getFormFields()}</div>

          <button
            onClick={calculateEstimate}
            disabled={loading || !formData.destination}
            className={`w-full p-3 flex items-center justify-center space-x-2 rounded-lg ${
              loading || !formData.destination
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Calculating...</span>
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4" />
                <span>Calculate Estimate</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default PriceEstimator;
