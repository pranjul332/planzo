import { Auth0Provider } from "@auth0/auth0-react";
import { AuthProvider } from "./Auth/AuthContext";
import { auth0Config } from "./Auth/AuthConfig";

import React from "react";
import Home from "./Pages/HomePage/Home";
import { Route, Routes } from "react-router-dom";
import Fligh from "./Pages/HomePage/Flight";
import Hote from "./Pages/HomePage/Hotel";
import Booking from "./Pages/BookingPage/Booking";
import Chat from "./Pages/GroupPage/Chat";
import TripsPage from "./Pages/MyTripPage/TripPage";

const App = () => {
  return (
    <Auth0Provider {...auth0Config}>
      <AuthProvider>
        <div>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/flights" element={<Home />}></Route>
            <Route path="/hotels" element={<Home />}></Route>
            <Route path="/holidays" element={<Home />}></Route>
            <Route path="/bus" element={<Home />}></Route>
            <Route path="/trains" element={<Home />}></Route>
            <Route path="/holidays/booking" element={<Booking />}></Route>
            <Route path="/chat/chatname" element={<Chat />}></Route>
            <Route path="/trip/ManageTrip" element={<TripsPage />}></Route>
            {/* <Route path="/trip/ManageTrip" element={<TripsPage/>}></Route> */}
          </Routes>
        </div>
      </AuthProvider>
    </Auth0Provider>
  );
};

export default App;
