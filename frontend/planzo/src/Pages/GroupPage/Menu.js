import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Map,
  Calculator,
  DollarSign,
  Lightbulb,
  FileText,
  X,
  BrainCircuit,
  Menu as MenuIcon,
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
  const [activeModal, setActiveModal] = useState(null);
  const [tripPlan, setTripPlan] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const chatId = useParams();

  // Track window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { id: "tripGraph", icon: BarChart3, label: "Trip Graph" },
    { id: "destinations", icon: Map, label: "Destinations" },
    { id: "tripCost", icon: Calculator, label: "Trip Cost" },
    { id: "priceEstimator", icon: DollarSign, label: "Price Estimator" },
    { id: "suggestions", icon: Lightbulb, label: "Suggestions" },
    { id: "notes", icon: FileText, label: "Important Notes" },
    { id: "AItrip", icon: BrainCircuit, label: "AI Trip" },
  ];

  const handleMenuItemClick = (itemId) => {
    setActiveModal(itemId);
    // On mobile, close the menu when an item is selected
    if (isMobile) {
      onClose();
    }
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handlePlanGenerated = (plan) => {
    setTripPlan(plan);
  };

  if (!isOpen) return null;

  // Function to render the appropriate component based on activeModal
  const renderModalContent = () => {
    switch (activeModal) {
      case "tripGraph":
        return <TripGraph tripData={tripData} />;
      case "destinations":
        return <Destinations tripData={tripData} />;
      case "tripCost":
        return <TripCost tripData={tripData} />;
      case "priceEstimator":
        return <PriceEstimator tripData={tripData} />;
      case "suggestions":
        return <Suggestions tripData={tripData} />;
      case "notes":
        return <Notes tripData={tripData} />;
      case "AItrip":
        return (
          <>
            <AiTripPlanner
              chatId={chatId}
              onPlanGenerated={handlePlanGenerated}
            />
            {tripPlan && (
              <div className="mt-6">
                <TripPlanDisplay plan={tripPlan} />
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  // Get the title for the modal
  const getModalTitle = () => {
    const item = menuItems.find((item) => item.id === activeModal);
    return item ? item.label : "";
  };

  return (
    <>
      {/* Sidebar - responsive with different widths based on screen size */}
      <div
        className={`
        fixed left-0 top-0 h-screen bg-white shadow-lg border-r animate-slide-in z-40
        ${isMobile ? "w-full md:w-80" : "w-80"}
      `}
      >
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
                onClick={() => handleMenuItemClick(item.id)}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                  item.id === "AItrip"
                    ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 shadow-md"
                    : "hover:bg-gray-100 hover:text-purple-600"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    item.id === "AItrip" ? "" : "text-gray-600"
                  }`}
                />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 p-4 bg-white">
            <p className="text-gray-500 text-center mt-10">
              Select an option from the menu to view details in a popup window.
            </p>
          </div>
        </div>
      </div>

      {/* Modal for all components - responsive sizing */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-purple-100 to-blue-50 sticky top-0 z-10">
              <h2 className="text-lg font-semibold text-purple-800">
                {getModalTitle()}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-white/50 rounded-full transition-all"
              >
                <X className="w-5 h-5 text-purple-700" />
              </button>
            </div>

            <div className="p-4 md:p-6">{renderModalContent()}</div>
          </div>
        </div>
      )}

      {/* Fixed action button for mobile to reopen menu after it's closed */}
      {!isOpen && isMobile && (
        <button
          onClick={() => onClose()}
          className="fixed bottom-6 right-6 bg-purple-600 text-white p-3 rounded-full shadow-lg z-30 md:hidden"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      )}
    </>
  );
};

export default Menu;
