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
  Zap,
  Star,
  TrendingUp,
  Bot,
  Award,
  Flame,
  IndianRupee,
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
  const [aiButtonHover, setAiButtonHover] = useState(false);
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

  // Add automatic pulsing effect to AI Trip Planner every few seconds
  useEffect(() => {
    if (isOpen && !activeModal) {
      const pulseInterval = setInterval(() => {
        setAiButtonHover(true);
        setTimeout(() => setAiButtonHover(false), 1000);
      }, 5000);
      return () => clearInterval(pulseInterval);
    }
  }, [isOpen, activeModal]);

  const menuItems = [
    {
      id: "AItrip",
      icon: BrainCircuit,
      label: "AI Trip Planner",
      secondaryIcon: Flame,
      color: "from-fuchsia-600 to-pink-600",
      description: "🔥 CREATE YOUR DREAM TRIP IN SECONDS!",
      isAI: true,
      featured: true,
      badge: "HOT",
      badgeColor: "bg-red-500",
    },
    {
      id: "priceEstimator",
      icon: IndianRupee,
      label: "AI Price Estimator",
      secondaryIcon: Bot,
      color: "from-purple-500 to-violet-400",
      description: "Get AI-powered cost estimates for your trip",
      isAI: true,
      badge: "AI",
      badgeColor: "bg-violet-500",
    },
    {
      id: "suggestions",
      icon: Lightbulb,
      label: "AI Suggestions",
      secondaryIcon: Star,
      color: "from-yellow-500 to-amber-400",
      description: "Smart AI recommendations for your destination",
      isAI: true,
      badge: "AI",
      badgeColor: "bg-amber-500",
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
      id: "tripGraph",
      icon: BarChart3,
      label: "Trip Graph",
      color: "from-blue-500 to-sky-400",
      description: "Visualize your trip data in charts and graphs",
    },
    {
      id: "notes",
      icon: FileText,
      label: "Important Notes",
      color: "from-red-500 to-rose-400",
      description: "Save important information about your trip",
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
            {menuItems.map((item) => {
              const isAiTripPlanner = item.id === "AItrip";

              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuItemClick(item.id)}
                  onMouseEnter={() => isAiTripPlanner && setAiButtonHover(true)}
                  onMouseLeave={() =>
                    isAiTripPlanner && setAiButtonHover(false)
                  }
                  className={`
                    flex items-center gap-3 p-3 rounded-xl transition-all relative overflow-hidden
                    ${
                      activeModal === item.id
                        ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                        : isAiTripPlanner
                        ? "bg-gradient-to-r from-fuchsia-600/10 to-pink-600/10 hover:from-fuchsia-600/20 hover:to-pink-600/20 text-gray-700 border border-pink-200"
                        : "hover:bg-white hover:shadow-md text-gray-700"
                    }
                    ${
                      isAiTripPlanner &&
                      (aiButtonHover || activeModal === item.id)
                        ? "transform scale-105 shadow-lg transition-transform"
                        : ""
                    }
                    ${isAiTripPlanner ? "mb-3 mt-1" : ""}
                    ${isSidebarCollapsed ? "justify-center" : ""}
                  `}
                >
                  <div
                    className={`
                    ${
                      activeModal === item.id
                        ? ""
                        : isAiTripPlanner
                        ? "bg-gradient-to-br from-fuchsia-100 to-pink-100"
                        : "bg-gray-100"
                    } 
                    p-2 rounded-lg flex items-center justify-center
                    ${isSidebarCollapsed ? "w-10 h-10" : "w-8 h-8"}
                    ${isAiTripPlanner ? "animate-pulse-slow" : ""}
                  `}
                  >
                    <item.icon
                      className={`
                      ${isSidebarCollapsed ? "w-6 h-6" : "w-4 h-4"}
                      ${
                        activeModal === item.id
                          ? "text-white"
                          : isAiTripPlanner
                          ? "text-fuchsia-600"
                          : item.isAI
                          ? "text-indigo-600"
                          : "text-gray-700"
                      }
                    `}
                    />
                  </div>

                  {!isSidebarCollapsed && (
                    <div className="flex flex-col text-left">
                      <span
                        className={`font-medium ${
                          isAiTripPlanner ? "text-fuchsia-700 font-bold" : ""
                        }`}
                      >
                        {item.label}
                      </span>
                      <span
                        className={`text-xs ${
                          activeModal === item.id
                            ? "text-white/80"
                            : isAiTripPlanner
                            ? "text-fuchsia-600 font-medium"
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

                  {/* Badge for AI items */}
                  {!isSidebarCollapsed && item.badge && (
                    <span
                      className={`absolute -right-1 -top-1 ${
                        item.badgeColor
                      } text-white text-xs py-1 px-2 
                        rounded-bl-lg rounded-tr-lg font-medium shadow-sm
                        ${
                          isAiTripPlanner
                            ? "transform rotate-12 animate-pulse"
                            : "transform rotate-6"
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Special effects for AI Trip Planner */}
                  {isAiTripPlanner && !isSidebarCollapsed && (
                    <>
                      {/* Starburst effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-400/20 to-pink-400/20 rounded-xl -z-10"></div>

                      {/* Sparkling icons */}
                      <span className="absolute top-1 left-32 text-yellow-400">
                        <Sparkles className="w-3 h-3 animate-ping" />
                      </span>
                      <span className="absolute bottom-1 right-12 text-orange-400">
                        <Zap className="w-3 h-3 animate-bounce" />
                      </span>

                      {/* Clickbait ribbon */}
                      {!activeModal && (
                        <div className="absolute -right-12 top-3 bg-red-500 text-white px-10 py-0.5 transform rotate-45 text-xs font-bold shadow-md">
                          TRENDING
                        </div>
                      )}
                    </>
                  )}
                </button>
              );
            })}
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

                {/* Special badge for AI-powered modals in header */}
                {getActiveItem()?.isAI && (
                  <span className="bg-white/20 text-white text-xs py-1 px-2 rounded-md font-medium flex items-center gap-1">
                    <Bot className="w-3 h-3" />
                    AI-POWERED
                  </span>
                )}
              </div>

              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-white/20 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Special banner for AI Trip Planner */}
            {activeModal === "AItrip" && (
              <div className="bg-gradient-to-r from-fuchsia-500 to-pink-500 p-2 text-white text-center text-sm font-medium flex items-center justify-center gap-2">
                <Flame className="w-4 h-4" />
                <span>
                  This AI planner has created over 10,000 personalized trips
                  this week!
                </span>
                <Flame className="w-4 h-4" />
              </div>
            )}

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
        .animate-pulse-slow {
          animation: pulse 3s infinite;
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
