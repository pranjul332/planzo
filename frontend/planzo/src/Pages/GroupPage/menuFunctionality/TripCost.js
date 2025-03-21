import React, { useState, useEffect } from "react";
import { Plane, Bed, Pizza, Ticket, PieChart, DollarSign } from "lucide-react";

const TripCost = ({ tripData = {} }) => {
  // Default cost data if none provided
  const defaultCosts = {
    travel: 1200,
    stay: 800,
    food: 400,
    activities: 500,
  };

  const [costs, setCosts] = useState(tripData.costs || defaultCosts);
  const [editMode, setEditMode] = useState(false);
  const [editedCosts, setEditedCosts] = useState(costs);

  const categories = [
    { id: "travel", name: "Travel", icon: Plane, color: "bg-blue-500" },
    { id: "stay", name: "Accommodation", icon: Bed, color: "bg-green-500" },
    { id: "food", name: "Food & Drinks", icon: Pizza, color: "bg-yellow-500" },
    {
      id: "activities",
      name: "Activities",
      icon: Ticket,
      color: "bg-purple-500",
    },
  ];

  const totalCost = Object.values(costs).reduce((sum, cost) => sum + cost, 0);

  // Calculate percentages for each category
  const calculatePercentage = (value) => {
    return Math.round((value / totalCost) * 100);
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Save changes
      setCosts(editedCosts);
    }
    setEditMode(!editMode);
  };

  const handleCostChange = (category, value) => {
    setEditedCosts({
      ...editedCosts,
      [category]: parseInt(value) || 0,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg text-gray-800">
          Trip Cost Breakdown
        </h3>
        <button
          onClick={handleEditToggle}
          className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
        >
          {editMode ? "Save Changes" : "Edit Costs"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-all"
          >
            <div className={`h-2 ${category.color}`}></div>
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <category.icon className="w-5 h-5 text-gray-700" />
                <h4 className="font-medium text-gray-800">{category.name}</h4>
              </div>

              {editMode ? (
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <input
                    type="number"
                    value={editedCosts[category.id]}
                    onChange={(e) =>
                      handleCostChange(category.id, e.target.value)
                    }
                    className="w-full p-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
              ) : (
                <>
                  <p className="text-xl font-bold">${costs[category.id]}</p>
                  <p className="text-xs text-gray-500">
                    {calculatePercentage(costs[category.id])}% of total
                  </p>

                  <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full ${category.color}`}
                      style={{
                        width: `${calculatePercentage(costs[category.id])}%`,
                      }}
                    ></div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <PieChart className="w-5 h-5 text-blue-700 mr-2" />
            <h4 className="font-medium text-blue-800">Total Trip Cost</h4>
          </div>
          <p className="text-2xl font-bold text-blue-900">
            $
            {editMode
              ? Object.values(editedCosts).reduce((sum, cost) => sum + cost, 0)
              : totalCost}
          </p>
        </div>

        {!editMode && (
          <div className="mt-4 grid grid-cols-4 gap-1">
            {categories.map((category) => (
              <div
                key={category.id}
                className="h-1.5 rounded-full overflow-hidden"
              >
                <div
                  className={`h-full ${category.color}`}
                  style={{ width: `100%` }}
                ></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripCost;
