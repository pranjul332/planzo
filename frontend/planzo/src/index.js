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

// Make sure these environment variables are correctly set
console.log("Auth0 Domain:", process.env.REACT_APP_AUTH0_DOMAIN);
console.log("Auth0 Client ID:", process.env.REACT_APP_AUTH0_CLIENT_ID);
console.log("Auth0 Audience:", process.env.REACT_APP_AUTH0_AUDIENCE);

const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope:
          "create:trips read:trips update:trips delete:trips openid profile email",
      }}
      cacheLocation="localstorage"
    >
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
