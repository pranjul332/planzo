import React from "react";
import PropTypes from "prop-types";
import { DollarSign, Bed, Utensils, Map, Plane } from "lucide-react";

export default function TripPlanDisplay({ plan }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold mb-4">Trip Plan Summary</h2>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Total Estimated Cost:</span>
          <span className="text-2xl font-bold text-indigo-600">
            ${plan.totalCost.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Bed className="w-5 h-5" />
            Accommodation
          </h3>
          <p className="text-indigo-600 font-semibold">
            ${plan.accommodation.cost.toLocaleString()}
          </p>
          <ul className="list-disc list-inside space-y-2">
            {plan.accommodation.suggestions.map((suggestion, index) => (
              <li key={index} className="text-gray-600">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Map className="w-5 h-5" />
            Activities
          </h3>
          <p className="text-indigo-600 font-semibold">
            ${plan.activities.cost.toLocaleString()}
          </p>
          <ul className="list-disc list-inside space-y-2">
            {plan.activities.suggestions.map((suggestion, index) => (
              <li key={index} className="text-gray-600">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Utensils className="w-5 h-5" />
            Food & Dining
          </h3>
          <p className="text-indigo-600 font-semibold">
            ${plan.food.cost.toLocaleString()}
          </p>
          <ul className="list-disc list-inside space-y-2">
            {plan.food.suggestions.map((suggestion, index) => (
              <li key={index} className="text-gray-600">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Plane className="w-5 h-5" />
            Transportation
          </h3>
          <p className="text-indigo-600 font-semibold">
            ${plan.transportation.cost.toLocaleString()}
          </p>
          <ul className="list-disc list-inside space-y-2">
            {plan.transportation.suggestions.map((suggestion, index) => (
              <li key={index} className="text-gray-600">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Suggested Itinerary</h3>
        <div className="space-y-4">
          {plan.itinerary.map((day, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Day {index + 1}</h4>
              <p className="text-gray-600">{day}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

TripPlanDisplay.propTypes = {
  plan: PropTypes.shape({
    accommodation: PropTypes.shape({
      cost: PropTypes.number.isRequired,
      suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    activities: PropTypes.shape({
      cost: PropTypes.number.isRequired,
      suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    food: PropTypes.shape({
      cost: PropTypes.number.isRequired,
      suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    transportation: PropTypes.shape({
      cost: PropTypes.number.isRequired,
      suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    totalCost: PropTypes.number.isRequired,
    itinerary: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};
