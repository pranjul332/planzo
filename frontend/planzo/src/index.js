import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './Pages/HomePage/Home';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'
import App from './App';
import Bus from './Pages/HomePage/Bus';
import TripsPage from './Pages/MyTripPage/TripPage';
import { Auth0Provider } from "@auth0/auth0-react";
import { AuthProvider } from './Auth/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain="dev-o12o1p7fhpbr5soe.us.auth0.com"
        clientId="rTSmiXDjsJNmPu4OOtOpHzp10dEM6q0O"
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
        cacheLocation="localstorage"
      >
        <App />
      </Auth0Provider>
      {/* <TripsPage/> */}
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
