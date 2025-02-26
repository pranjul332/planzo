import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const SignUp = () => {
  const { user, loginWithRedirect, logout, isAuthenticated, isLoading } =
    useAuth0();
  console.log("Current User", user);

  useEffect(() => {
    const saveUserDetails = async () => {
      if (user) {
        try {
          await axios.post("http://localhost:5000/api/users/save", user);
          console.log("User details saved");
        } catch (error) {
          console.error("Error saving user details:", error);
        }
      }
    };
    saveUserDetails();
  }, [user]);

  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <header>
        {isAuthenticated ? (
          <div>
            <p>Welcome, {user.name}</p>
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Logout
            </button>
          </div>
        ) : (
          <button onClick={() => loginWithRedirect()}>Login</button>
        )}
      </header>
    </div>
  );
};

export default SignUp;
