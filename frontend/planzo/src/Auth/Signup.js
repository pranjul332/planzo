import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const SignUp = () => {
  const { user, loginWithRedirect, logout, isAuthenticated, isLoading } =
    useAuth0();
  const [isSaving, setIsSaving] = useState(false);

  console.log("Current User", user);

  useEffect(() => {
    const saveUserDetails = async () => {
      if (user) {
        setIsSaving(true);
        try {
           const userData = {
             email: user.email,
             name: user.name,
             picture: user.picture,
             sub: user.sub,
           };
          console.log("Sending user data:", userData); // Add this line to see the complete data
          await axios.post("http://localhost:5000/api/users", userData);
          console.log("User details saved");
        } catch (error) {
          console.error("Error saving user details:", error);
          // Log the specific error response data
          if (error.response) {
            console.error("Error response data:", error.response.data);
          }
        } finally {
          setIsSaving(false);
        }
      }
    };

    if (user) {
      saveUserDetails();
    }
  }, [user]);

  const handleLogin = () => {
    // Optimize Auth0 login by specifying prompt behavior
    loginWithRedirect({
      prompt: "login",
      connection: "your-connection-name", // Specify your main connection
      ui_locales: "en",
      scope: "openid profile email",
    });
  };

  return (
    <div>
      <header className="flex items-center space-x-4 p-4">
        {isAuthenticated ? (
          <div className="flex items-center">
            {user.picture && (
              <img
                src={user.picture}
                alt="Profile"
                className="w-10 h-10 rounded-full mr-3"
              />
            )}
            <div>
              <p className="font-medium">{user.name}</p>
              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() =>
              loginWithRedirect({
                prompt: "login",
                connection: "your-connection-name", // Specify your main connection
                ui_locales: "en",
                scope: "openid profile email",
              })
            }
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        )}
      </header>
    </div>
  );
};

export default SignUp;
