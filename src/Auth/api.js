import axios from "axios";

// Create axios instance with credentials
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Set the token in the auth header
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("auth_token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("auth_token");
  }
};

// Auth API calls
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const response = await api.put("/auth/profile", userData);
  return response.data;
};

// Add Auth0 integration endpoints
export const linkAuth0Account = async (auth0Id) => {
  const response = await api.post("/auth/link-auth0", { auth0Id });
  return response.data;
};

// Add error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("auth_token");
    }
    return Promise.reject(error);
  }
);

export default api;
