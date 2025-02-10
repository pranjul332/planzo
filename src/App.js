
import React from 'react'
import Home from './Pages/HomePage/Home'
import { Route ,Routes } from "react-router-dom";
import Fligh from './Pages/HomePage/Flight';
import Hote from './Pages/HomePage/Hotel';

const App = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Fligh />
              <Home />
            </>
          }
        ></Route>
        <Route path="/flights" element={<Fligh />}></Route>
        <Route path="/hotels" element={<Hote />}></Route>
      </Routes>
    </div>
  );
}

export default App
