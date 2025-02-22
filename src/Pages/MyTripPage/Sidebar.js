import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  User,
  Gift,
  Users,
  LayoutDashboard,
  List,
  Crown,
  LogOut,
} from "lucide-react";

const SidebarItem = ({ icon, text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
    >
      {icon}
      <span>{text}</span>
    </button>
  );
};

const Sidebar = ({ isOpen, closeSidebar, user }) => {
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (isOpen) {
        closeSidebar();
      }
    };

    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [isOpen, closeSidebar]);

  const handleNavigation = (path) => {
    navigate(path);
    closeSidebar();
  };

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...");
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 right-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-0"
      } overflow-hidden z-50`}
    >
      <div className="p-4">
        <button
          onClick={closeSidebar}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center mb-6 mt-8">
          <div className="w-20 h-20 bg-gray-200 rounded-full mb-2">
            <img
              src="/api/placeholder/80/80"
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <span className="font-medium text-gray-800">
            {user?.name || "Guest"}
          </span>
          <span className="text-sm text-gray-500">{user?.email || ""}</span>
        </div>

        <nav className="flex flex-col gap-2">
          <SidebarItem
            icon={<User />}
            text="Profile"
            onClick={() => handleNavigation("/profile")}
          />
          <SidebarItem
            icon={<Gift />}
            text="Offer"
            onClick={() => handleNavigation("/offer")}
          />
          <SidebarItem
            icon={<Users />}
            text="My Friends"
            onClick={() => handleNavigation("/friends")}
          />
          <SidebarItem
            icon={<LayoutDashboard />}
            text="Dashboard"
            onClick={() => handleNavigation("/dashboard")}
          />
          <SidebarItem
            icon={<List />}
            text="Bucket List"
            onClick={() => handleNavigation("/bucketlist")}
          />
          <SidebarItem
            icon={<Crown />}
            text="Premium"
            onClick={() => handleNavigation("/premium")}
          />
        </nav>

        <div className="absolute bottom-4 left-0 w-full px-4">
          <SidebarItem icon={<LogOut />} text="Logout" onClick={handleLogout} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
