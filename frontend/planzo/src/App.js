import React from "react";
import { Route, Routes } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { AuthProvider } from "./Auth/AuthContext";
import { auth0Config } from "./Auth/AuthConfig";

// Pages
import Home from "./Pages/HomePage/Home";
import Booking from "./Pages/BookingPage/Booking";
import Chat from "./Pages/GroupPage/Chat";
import TripsPage from "./Pages/MyTripPage/TripPage";
import Layout from "./Pages/SidebarPage/Layout";
import Profile from "./Pages/SidebarPage/Profile";
import Offer from "./Pages/SidebarPage/Offer";
import Friends from "./Pages/SidebarPage/Friends";
import Dashboard from "./Pages/SidebarPage/Dashboard";
import BucketList from "./Pages/SidebarPage/BucketList";
import PremiumFeatures from "./Pages/SidebarPage/PremiumFeatures";

// Auth components
import ProtectedRoute from "./Auth/ProtectedRoute";

const App = () => {
  return (
    
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/flights" element={<Home />} />
          <Route path="/hotels" element={<Home />} />
          <Route path="/holidays" element={<Home />} />
          <Route path="/bus" element={<Home />} />
          <Route path="/trains" element={<Home />} />

          {/* Protected routes - require authentication */}
          
            <Route path="/holidays/booking" element={<Booking />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/trip/ManageTrip" element={<TripsPage />} />

            {/* Nested routes inside Layout */}
            <Route path="/" element={<Layout />}>
              <Route path="profile" element={<Profile />} />
              <Route path="offer" element={<Offer />} />
              <Route path="friends" element={<Friends />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="bucketlist" element={<BucketList />} />
              <Route path="premium" element={<PremiumFeatures />} />
            </Route>
          
        </Routes>
     
  );
};

export default App;
