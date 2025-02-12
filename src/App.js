
import React from 'react'
import Home from './Pages/HomePage/Home'
import { Route ,Routes } from "react-router-dom";
import Fligh from './Pages/HomePage/Flight';
import Hote from './Pages/HomePage/Hotel';
import Booking from './Pages/BookingPage/Booking';
import Chat from './Pages/GroupPage/Chat';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={ <Home /> }></Route>
        <Route path="/flights" element={<Home/>}></Route>
        <Route path="/hotels" element={<Home/>}></Route>
        <Route path="/holidays" element={<Home/>}></Route>
        <Route path="/bus" element={<Home/>}></Route>
        <Route path="/trains" element={<Home/>}></Route>
        <Route path="/holidays/booking" element={<Booking/>}></Route>
        <Route path="/chat/chatname" element={<Chat/>}></Route>
      </Routes>
    </div>
  );
}

export default App
