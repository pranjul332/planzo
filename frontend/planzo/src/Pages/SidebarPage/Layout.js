import React, { useState } from "react";
import Sidebar from "../MyTripPage/Sidebar";
import { useNavigate, Outlet } from "react-router-dom"; // Import Outlet for nested routes
import { List , ArrowLeft } from "lucide-react";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-semibold text-gray-900">
              <ArrowLeft
                className="cursor-pointer"
                onClick={() => navigate("/trip/manageTrip")}
              />
            </h1>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <List className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />{" "}
        {/* This will render the appropriate component based on the route */}
      </main>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />
    </div>
  );
};

export default Layout;
