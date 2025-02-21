import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { LogIn, LogOut, UserCircle, Loader2 } from "lucide-react";

const AuthComp = () => {
  const { loginWithRedirect, isAuthenticated, logout, user, isLoading } =
    useAuth0();

  const handleLogin = async () => {
    try {
      await loginWithRedirect();
    } catch (error) {
      console.error("Login error:", error);
      // You might want to show a user-friendly error message here
    }
  };

  const handleLogout = async () => {
    try {
      await logout({
        returnTo: window.location.origin,
        clientId: "rTSmiXDjsJNmPu4OOtOpHzp10dEM6q0O",
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback manual cleanup
      localStorage.removeItem("auth0.is.authenticated");
      window.location.href = window.location.origin;
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
    <button
      onClick={handleLogin}
      className="bg-red-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors"
    >
      <LogIn size={20} />
      <span>Login / Signup</span>
    </button>
  );
};

export default AuthComp;
