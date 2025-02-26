import React, { useState } from "react";
import { LogIn, LogOut, UserCircle, Loader2, Github } from "lucide-react";
import { useAuth } from "./AuthContext";
import AuthModal from "./AuthModal";

const AuthComp = () => {
  const {
    isAuthenticated,
    user,
    logout,
    loginWithAuth0,
    isLoading,
    authMethod,
  } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <button
        disabled
        className="bg-red-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
      >
        <Loader2 className="animate-spin" size={20} />
        <span>Loading...</span>
      </button>
    );
  }

  // Authenticated state
  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name || "Profile"}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <UserCircle size={32} />
          )}
          <span className="hidden md:inline text-sm text-gray-700">
            {authMethod === "auth0" ? "Auth0" : "Email"}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors"
        >
          <span className="max-w-[100px] truncate">
            {user?.name || user?.email || "User"}
          </span>
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  // Unauthenticated state
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setShowAuthModal(true)}
        className="bg-red-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors"
      >
        <LogIn size={20} />
        <span>Email Login</span>
      </button>

      <button
        onClick={loginWithAuth0}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
      >
        <Github size={20} />
        <span className="hidden md:inline">Login with Auth0</span>
      </button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default AuthComp;
