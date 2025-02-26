import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  setAuthToken,
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  updateUserProfile,
} from "./api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Auth0 hooks
  const {
    isAuthenticated: isAuth0Authenticated,
    user: auth0User,
    loginWithRedirect: auth0Login,
    logout: auth0Logout,
    getAccessTokenSilently,
    isLoading: isAuth0Loading,
  } = useAuth0();

  // Local state
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("auth_token"));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authMethod, setAuthMethod] = useState("local"); // 'local' or 'auth0'

  // Set token in axios and localStorage when it changes
  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  // Handle Auth0 authentication
  useEffect(() => {
    const handleAuth0User = async () => {
      if (isAuth0Authenticated && auth0User) {
        try {
          setIsLoading(true);
          setAuthMethod("auth0");

          // Get Auth0 access token with the correct audience
          const accessToken = await getAccessTokenSilently({
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          });

          console.log("Auth0 token obtained:", accessToken);
          setToken(accessToken);
          localStorage.setItem("auth_token", accessToken);

          // Either fetch user from backend or create user record
          try {
            // Try to get existing user
            const response = await getCurrentUser();
            setCurrentUser(response.user);
          } catch (err) {
            // If user doesn't exist, create one
            const userData = {
              name: auth0User.name,
              email: auth0User.email,
              picture: auth0User.picture,
              auth0Id: auth0User.sub,
            };
            const data = await registerUser(userData);
            setCurrentUser(data.user);
          }

          setError(null);
        } catch (err) {
          console.error("Error processing Auth0 user", err);
          setError("Failed to process Auth0 authentication");
        } finally {
          setIsLoading(false);
        }
      } else if (!isAuth0Loading && !isAuth0Authenticated) {
        // Only handle local auth if Auth0 is not authenticating
        if (authMethod === "auth0") {
          // Clear local auth if previously using Auth0
          setToken(null);
          setCurrentUser(null);
          setAuthMethod("local");
        }
      }
    };

    handleAuth0User();
  }, [isAuth0Authenticated, auth0User, isAuth0Loading, getAccessTokenSilently]);

  // Load user on initial load and token change (local auth)
  useEffect(() => {
    const loadUser = async () => {
      if (!token || authMethod === "auth0") {
        if (!isAuth0Loading) {
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        const response = await getCurrentUser();
        setCurrentUser(response.user);
        setAuthMethod("local");
        setError(null);
      } catch (err) {
        console.error("Error loading user", err);
        setToken(null);
        setCurrentUser(null);
        setError("Session expired. Please login again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [token, authMethod, isAuth0Loading]);

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const data = await registerUser(userData);
      setToken(data.token);
      setCurrentUser(data.user);
      setAuthMethod("local");
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const data = await loginUser(credentials);
      setToken(data.token);
      setCurrentUser(data.user);
      setAuthMethod("local");
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      if (authMethod === "auth0") {
        auth0Logout({ returnTo: window.location.origin });
      } else {
        await logoutUser();
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setToken(null);
      setCurrentUser(null);
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData) => {
    try {
      setIsLoading(true);
      const data = await updateUserProfile(userData);
      setCurrentUser(data.user);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Login methods
  const loginWithAuth0 = () => {
    return auth0Login();
  };

  const value = {
    isAuthenticated: !!currentUser || isAuth0Authenticated,
    user: currentUser || auth0User,
    login,
    loginWithAuth0,
    logout,
    register,
    updateProfile,
    isLoading: isLoading || isAuth0Loading,
    error,
    authMethod,
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
