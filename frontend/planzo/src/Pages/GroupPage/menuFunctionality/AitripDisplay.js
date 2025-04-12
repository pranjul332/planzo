import React from "react";
import PropTypes from "prop-types";
import {
  DollarSign,
  Bed,
  Utensils,
  Map,
  Plane,
  Calendar,
  Clock,
} from "lucide-react";

export default function TripPlanDisplay({ plan }) {
  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-xl p-8 space-y-8">
      <div className="border-b border-indigo-100 pb-6">
        <h2 className="text-3xl font-bold mb-4 text-indigo-900 flex items-center gap-3">
          <span className="bg-indigo-600 text-white p-2 rounded-lg">
            <Calendar className="w-6 h-6" />
          </span>
          Trip Plan Summary
        </h2>

        <div className="flex items-center justify-between mt-4">
          <span className="text-gray-600 text-lg">Total Estimated Cost:</span>
          <div className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md">
            <DollarSign className="w-5 h-5" />
            <span className="text-2xl font-bold">
              {plan.totalCost.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            title: "Accommodation",
            icon: <Bed className="w-5 h-5" />,
            data: plan.accommodation,
            bgColor: "bg-blue-500",
          },
          {
            title: "Activities",
            icon: <Map className="w-5 h-5" />,
            data: plan.activities,
            bgColor: "bg-green-500",
          },
          {
            title: "Food & Dining",
            icon: <Utensils className="w-5 h-5" />,
            data: plan.food,
            bgColor: "bg-yellow-500",
          },
          {
            title: "Transportation",
            icon: <Plane className="w-5 h-5" />,
            data: plan.transportation,
            bgColor: "bg-purple-500",
          },
        ].map((section, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-1"
          >
            <div
              className={`${section.bgColor} p-4 text-white flex items-center justify-between`}
            >
              <h3 className="text-xl font-semibold flex items-center gap-2">
                {section.icon}
                {section.title}
              </h3>
              <div className="bg-white text-indigo-600 px-3 py-1 rounded-full font-bold shadow-sm">
                ${section.data.cost.toLocaleString()}
              </div>
            </div>

            <div className="p-4">
              <ul className="space-y-3">
                {section.data.suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-gray-700"
                  >
                    <div className="min-w-6 mt-1">
                      <div className="w-2 h-2 rounded-full bg-indigo-400" />
                    </div>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-indigo-100">
        <h3 className="text-xl font-bold mb-6 text-indigo-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          Daily Itinerary
        </h3>

        <div className="space-y-4">
          {plan.itinerary.map((day, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg shadow border-l-4 border-indigo-500 hover:shadow-md transition-all"
            >
              <h4 className="font-bold mb-2 text-indigo-800">
                Day {index + 1}
              </h4>
              <p className="text-gray-700">{day}</p>
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
