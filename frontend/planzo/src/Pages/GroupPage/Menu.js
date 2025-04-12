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
import TripGraph from "./menuFunctionality/GraphCompo";
import Destinations from "./menuFunctionality/Destinations";
import TripCost from "./menuFunctionality/TripCost";
import PriceEstimator from "./menuFunctionality/PriceEstimator";
import Suggestions from "./menuFunctionality/Suggestions";
import Notes from "./menuFunctionality/Notes";
import AiTripPlanner from "./menuFunctionality/AItrip";
import TripPlanDisplay from "./menuFunctionality/AitripDisplay";
import { useParams } from "react-router-dom";

const Menu = ({ isOpen, onClose, tripData }) => {
  const [activeTab, setActiveTab] = useState("tripGraph");
  const [showAiModal, setShowAiModal] = useState(false);
  const [tripPlan, setTripPlan] = useState(null); // For AI trip plan result
  const chatId = useParams();

  const menuItems = [
    { id: "tripGraph", icon: BarChart3, label: "Trip Graph" },
    { id: "destinations", icon: Map, label: "Destinations" },
    { id: "tripCost", icon: Calculator, label: "Trip Cost" },
    { id: "priceEstimator", icon: DollarSign, label: "Price Estimator" },
    { id: "suggestions", icon: Lightbulb, label: "Suggestions" },
    { id: "notes", icon: FileText, label: "Important Notes" },
    { id: "AItrip", icon: BrainCircuit, label: "AI Trip" },
  ];

  const handleAiButtonClick = () => {
    setShowAiModal(true);
  };

  const handleCloseAiModal = () => {
    setShowAiModal(false);
    // Keep the trip plan data even after closing the modal
  };

  const handlePlanGenerated = (plan) => {
    setTripPlan(plan);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="absolute left-0 top-0 w-80 h-screen bg-white shadow-lg border-r animate-slide-in z-30">
        <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-purple-100 to-blue-50">
          <h2 className="text-lg font-semibold text-purple-800">
            Travel Planning
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/50 rounded-full transition-all"
          >
            <X className="w-5 h-5 text-purple-700" />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-4rem)]">
          <div className="flex flex-col space-y-1 p-2 bg-gray-50">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "AItrip") {
                    handleAiButtonClick();
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                  item.id === "AItrip"
                    ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 shadow-md"
                    : activeTab === item.id
                    ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500 shadow-sm"
                    : "hover:bg-gray-100 hover:text-purple-600"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    item.id === "AItrip"
                      ? ""
                      : activeTab === item.id
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-white">
            {activeTab === "tripGraph" && <TripGraph tripData={tripData} />}
            {activeTab === "destinations" && (
              <Destinations tripData={tripData} />
            )}
            {activeTab === "tripCost" && <TripCost tripData={tripData} />}
            {activeTab === "priceEstimator" && (
              <PriceEstimator tripData={tripData} />
            )}
            {activeTab === "suggestions" && <Suggestions tripData={tripData} />}
            {activeTab === "notes" && <Notes tripData={tripData} />}
          </div>
        </div>
      </div>

      {/* AI Trip Planner Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-purple-100 to-blue-50">
              <h2 className="text-lg font-semibold text-purple-800">
                AI Trip Planner
              </h2>
              <button
                onClick={handleCloseAiModal}
                className="p-1 hover:bg-white/50 rounded-full transition-all"
              >
                <X className="w-5 h-5 text-purple-700" />
              </button>
            </div>

            <div className="p-6">
              <AiTripPlanner
                chatId={chatId}
                onPlanGenerated={handlePlanGenerated}
              />
              {tripPlan && (
                <div className="mt-6">
                  <TripPlanDisplay plan={tripPlan} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Menu;
