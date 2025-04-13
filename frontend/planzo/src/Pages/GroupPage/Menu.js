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
  ChevronRight,
  ArrowRight,
  Globe,
  Sparkles,
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
  const [previousActive, setPreviousActive] = useState(null);
  const [tripPlan, setTripPlan] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const chatId = useParams();

  // Track window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show tip randomly after some time
  useEffect(() => {
    if (isOpen && !activeModal) {
      const timer = setTimeout(() => {
        setShowTip(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, activeModal]);

  const menuItems = [
    {
      id: "tripGraph",
      icon: BarChart3,
      label: "Trip Graph",
      color: "from-blue-500 to-sky-400",
      description: "Visualize your trip data in charts and graphs",
    },
    {
      id: "destinations",
      icon: Globe,
      label: "Destinations",
      color: "from-emerald-500 to-green-400",
      description: "Manage and explore your travel destinations",
    },
    {
      id: "tripCost",
      icon: Calculator,
      label: "Trip Cost",
      color: "from-orange-500 to-amber-400",
      description: "Track and analyze your trip expenses",
    },
    {
      id: "priceEstimator",
      icon: DollarSign,
      label: "Price Estimator",
      color: "from-purple-500 to-violet-400",
      description: "Estimate costs for your upcoming travel plans",
    },
    {
      id: "suggestions",
      icon: Lightbulb,
      label: "Suggestions",
      color: "from-yellow-500 to-amber-400",
      description: "Get personalized travel recommendations",
    },
    {
      id: "notes",
      icon: FileText,
      label: "Important Notes",
      color: "from-red-500 to-rose-400",
      description: "Save important information about your trip",
    },
    {
      id: "AItrip",
      icon: BrainCircuit,
      label: "AI Trip Planner",
      color: "from-indigo-600 to-purple-500",
      description: "Let AI create your perfect travel itinerary",
    },
  ];

  const handleMenuItemClick = (itemId) => {
    setPreviousActive(activeModal);
    setActiveModal(itemId);
    // On mobile, close the menu when an item is selected
    if (isMobile) {
      onClose();
    }
    setShowTip(false);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handlePlanGenerated = (plan) => {
    setTripPlan(plan);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
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

  // Get the color for the modal header
  const getModalColor = () => {
    const item = menuItems.find((item) => item.id === activeModal);
    return item ? item.color : "from-purple-600 to-blue-500";
  };

  // Get the active menu item
  const getActiveItem = () => {
    return menuItems.find((item) => item.id === activeModal);
  };

  // Get the icon component for the active item
  const getActiveIcon = () => {
    const activeItem = menuItems.find((item) => item.id === activeModal);
    return activeItem ? activeItem.icon : null;
  };

  // Determine which icon component to render
  const ActiveIcon = getActiveIcon();

  return (
    <>
      {/* Sidebar - responsive with different widths based on screen size */}
      <div
        className={`
        fixed left-0 top-0 h-screen bg-white shadow-xl border-r z-40 transition-all duration-300
        ${isMobile ? "w-full" : isSidebarCollapsed ? "w-20" : "w-80"}
      `}
      >
        <div
          className={`p-4 border-b flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-700 text-white ${
            isSidebarCollapsed ? "justify-center" : ""
          }`}
        >
          {!isSidebarCollapsed && (
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Globe className="w-6 h-6" />
              TravelPlanner Pro
            </h2>
          )}

          {isSidebarCollapsed && <Globe className="w-8 h-8" />}

          <div className="flex items-center gap-2">
            {!isMobile && !isSidebarCollapsed && (
              <button
                onClick={toggleSidebar}
                className="p-1 hover:bg-white/20 rounded-full transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {!isSidebarCollapsed && (
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {isSidebarCollapsed && (
              <button
                onClick={toggleSidebar}
                className="p-1 hover:bg-white/20 rounded-full transition-all"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col h-[calc(100%-4rem)] bg-gray-50">
          <div className="flex flex-col space-y-2 p-3 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item.id)}
                className={`
                  flex items-center gap-3 p-3 rounded-xl transition-all relative overflow-hidden
                  ${
                    activeModal === item.id
                      ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                      : "hover:bg-white hover:shadow-md text-gray-700"
                  }
                  ${isSidebarCollapsed ? "justify-center" : ""}
                `}
              >
                <div
                  className={`
                  ${activeModal === item.id ? "" : "bg-gray-100"} 
                  p-2 rounded-lg flex items-center justify-center
                  ${isSidebarCollapsed ? "w-10 h-10" : "w-8 h-8"}
                `}
                >
                  <item.icon
                    className={`
                    ${isSidebarCollapsed ? "w-6 h-6" : "w-4 h-4"}
                    ${
                      activeModal === item.id
                        ? "text-white"
                        : item.id === "AItrip"
                        ? "text-indigo-600"
                        : "text-gray-700"
                    }
                  `}
                  />
                </div>

                {!isSidebarCollapsed && (
                  <div className="flex flex-col text-left">
                    <span className="font-medium">{item.label}</span>
                    <span
                      className={`text-xs ${
                        activeModal === item.id
                          ? "text-white/80"
                          : "text-gray-500"
                      }`}
                    >
                      {item.description}
                    </span>
                  </div>
                )}

                {!isSidebarCollapsed && activeModal === item.id && (
                  <span className="absolute right-3">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}

                {item.id === "AItrip" && !isSidebarCollapsed && (
                  <span className="absolute -right-1 -top-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs py-1 px-2 rounded-bl-lg rounded-tr-lg font-medium transform rotate-12 shadow-sm">
                    AI
                  </span>
                )}
              </button>
            ))}
          </div>

          {!isSidebarCollapsed && showTip && !activeModal && (
            <div className="m-3 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 animate-pulse">
              <div className="flex items-center gap-2 font-medium mb-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                Pro Tip
              </div>
              <p className="text-sm">
                Try the AI Trip Planner to create a personalized travel
                itinerary in seconds!
              </p>
            </div>
          )}

          {isSidebarCollapsed && (
            <div className="mt-auto mb-6 flex justify-center">
              <div className="bg-indigo-100 p-2 rounded-full">
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for all components - responsive sizing with animations */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
            <div
              className={`p-4 flex justify-between items-center bg-gradient-to-r ${getModalColor()} text-white sticky top-0 z-10`}
            >
              <div className="flex items-center gap-3">
                {ActiveIcon && (
                  <div className="bg-white/20 p-2 rounded-lg">
                    <ActiveIcon className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold">{getModalTitle()}</h2>
                  <p className="text-sm text-white/80">
                    {getActiveItem()?.description}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-white/20 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow">
              {renderModalContent()}
            </div>
          </div>
        </div>
      )}

      {/* Fixed action button for mobile to reopen menu after it's closed */}
      {!isOpen && isMobile && (
        <button
          onClick={() => onClose()}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg z-30"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      )}

      {/* Add these styles to your CSS file or use a style tag */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </>
  );
};

export default Menu;
