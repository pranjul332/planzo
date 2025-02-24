import React, { useState } from "react";
import {
  BarChart3,
  Map,
  Calculator,
  DollarSign,
  Lightbulb,
  FileText,
  X,
  BrainCircuit,
} from "lucide-react";

const Menu = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("tripGraph");

  const menuItems = [
    { id: "tripGraph", icon: BarChart3, label: "Trip Graph" },
    { id: "destinations", icon: Map, label: "Destinations" },
    { id: "tripCost", icon: Calculator, label: "Trip Cost" },
    { id: "priceEstimator", icon: DollarSign, label: "Price Estimator" },
    { id: "suggestions", icon: Lightbulb, label: "Suggestions" },
    { id: "notes", icon: FileText, label: "Important Notes" },
    { id: "AItrip", icon: BrainCircuit, label: "AI Trip" },
  ];

  if (!isOpen) return null;

  return (
    <div className="absolute left-0 top-0 w-80 h-screen bg-white shadow-lg border-r animate-slide-in">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Travel Planning</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col h-[calc(100%-4rem)]">
        <div className="flex flex-col space-y-1 p-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                item.id === "AItrip"
                  ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600" // Permanent gradient for AI Trip
                  : activeTab === item.id
                  ? "bg-blue-50 text-blue-600" // Default for other active tabs
                  : "hover:bg-gray-100" // Default hover for other tabs
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {activeTab === "tripGraph" && <TripGraph />}
          {activeTab === "destinations" && <Destinations />}
          {activeTab === "tripCost" && <TripCost />}
          {activeTab === "priceEstimator" && <PriceEstimator />}
          {activeTab === "suggestions" && <Suggestions />}
          {activeTab === "notes" && <Notes />}
          {activeTab === "AItrip" && <AItrip />}
        </div>
      </div>
    </div>
  );
};
const TripGraph = () => (
  <div className="space-y-4">
    <h3 className="font-semibold">Trip Timeline</h3>
    <div className="h-64 bg-gray-50 rounded-lg border p-4 flex items-center justify-center">
      <span className="text-gray-500">
        Trip visualization graph will appear here
      </span>
    </div>
  </div>
);

const Destinations = () => (
  <div className="space-y-4">
    <h3 className="font-semibold">Selected Destinations</h3>
    <div className="space-y-2">
      {["Paris", "Rome", "Barcelona"].map((city) => (
        <div key={city} className="p-3 bg-gray-50 rounded-lg">
          <p className="font-medium">{city}</p>
          <p className="text-sm text-gray-500">3 days planned</p>
        </div>
      ))}
    </div>
  </div>
);

const TripCost = () => (
  <div className="space-y-4">
    <h3 className="font-semibold">Trip Cost Breakdown</h3>
    <div className="space-y-2">
      {[
        { category: "Flights", cost: 1200 },
        { category: "Hotels", cost: 800 },
        { category: "Activities", cost: 500 },
      ].map((item) => (
        <div
          key={item.category}
          className="flex justify-between p-3 bg-gray-50 rounded-lg"
        >
          <span>{item.category}</span>
          <span className="font-medium">${item.cost}</span>
        </div>
      ))}
    </div>
  </div>
);

const AItrip = () => (
  <div className="space-y-4">
    <h3 className="font-semibold">AI Trip Planner</h3>
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Enter your destination"
        className="w-full p-2 border rounded-lg"
      />
      <input
        type="number"
        placeholder="Number of days"
        className="w-full p-2 border rounded-lg"
      />
      <button className="w-full p-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600">
        Generate Plan
      </button>
    </div>
  </div>
);

const PriceEstimator = () => (
  <div className="space-y-4">
    <h3 className="font-semibold">Price Estimator</h3>
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Enter destination"
        className="w-full p-2 border rounded-lg"
      />
      <input
        type="number"
        placeholder="Number of days"
        className="w-full p-2 border rounded-lg"
      />
      <button className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        Calculate Estimate
      </button>
    </div>
  </div>
);

const Suggestions = () => (
  <div className="space-y-4">
    <h3 className="font-semibold">AI Suggestions</h3>
    <div className="space-y-2">
      {[
        "Consider visiting during off-peak season",
        "Book flights 3 months in advance",
        "Get a city pass for attractions",
      ].map((suggestion, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm">{suggestion}</p>
        </div>
      ))}
    </div>
  </div>
);

const Notes = () => (
  <div className="space-y-4">
    <h3 className="font-semibold">Important Notes</h3>
    <textarea
      className="w-full h-40 p-3 border rounded-lg resize-none"
      placeholder="Add important notes about your trip..."
    />
  </div>
);

export default Menu;
