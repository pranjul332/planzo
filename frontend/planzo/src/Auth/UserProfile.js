// src/components/UserProfile.js
import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const UserProfile = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState(null);
    console.log(user)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch("http://localhost:3001/api/protected", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [getAccessTokenSilently, user]);

  return (
    <div>
      <h2>User Profile</h2>
      {userData ? (
        <div>
          <p>Name: {userData.user.name}</p>
          <p>Email: {userData.user.email}</p>
          <p>MongoDB ID: {userData.dbUser}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserProfile;
