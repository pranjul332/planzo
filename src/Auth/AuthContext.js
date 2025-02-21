// src/auth/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { isAuthenticated, user, loginWithRedirect, logout, isLoading } =
    useAuth0();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  const value = {
    isAuthenticated,
    user: currentUser,
    login: loginWithRedirect,
    logout: () => logout({ returnTo: window.location.origin }),
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

