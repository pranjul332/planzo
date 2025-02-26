// api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Set the auth token for the API requests
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("auth_token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("auth_token");
    delete api.defaults.headers.common["Authorization"];
  }
};

// Register a new user
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// Login a user with email and password
export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

// Process Auth0 user
// In api.js
export const processAuth0User = async (token) => {
  try {
    console.log("Processing Auth0 user with token:", token);
    
    // Make sure the token is correctly set for the request
    setAuthToken(token);
    
    // Make the request to your backend
    const response = await api.post('/auth/auth0');
    console.log("Auth0 backend response:", response.data);
    
    return response.data;
  } catch (error) {
    console.error('Auth0 processing error:', error.response?.data || error.message);
    throw error;
  }
};

// Get the current user
export const getCurrentUser = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

// Update user profile
export const updateUserProfile = async (userData) => {
  const response = await api.put("/users/profile", userData);
  return response.data;
};

// Logout user
export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export default api;
