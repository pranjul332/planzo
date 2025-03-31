const axios = require("axios");

const AUTH0_DOMAIN = "dev-o12o1p7fhpbr5soe.us.auth0.com";
const CLIENT_ID = "3DAPa7GVN1yVfVQQFmrA2vTCvunYCmtx";
const CLIENT_SECRET =
  "9fArwLYTHBhe6SoDeFuL15dNV7zWVevTilZ8YD4SJLV6WKV8CyGTRdQx6OAMes8q";
const AUDIENCE = `https://${"dev-o12o1p7fhpbr5soe.us.auth0.com"}/api/v2/`;
const GRANT_TYPE = "client_credentials";

// Token cache with expiration handling
let tokenData = {
  accessToken: null,
  expiresAt: null, 
}; 

// Function to get the Auth0 Management API token
async function getManagementApiToken() {
  const now = Date.now(); 

  // Check if we have a valid cached token (with 60s buffer before expiry)
  if (tokenData.accessToken && tokenData.expiresAt > now + 60000) {
    return tokenData.accessToken;  
  }

  try {
    const response = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      audience: AUDIENCE,
      grant_type: GRANT_TYPE,
    }); 

    // Calculate expiration time (converting expires_in from seconds to milliseconds)
    const expiresAt = now + response.data.expires_in * 1000;

    // Update token cache
    tokenData = {
      accessToken: response.data.access_token,
      expiresAt: expiresAt,
    };

    return tokenData.accessToken;
  } catch (error) {
    console.error(
      "Error getting Auth0 API token:",
      error.response?.data || error.message
    );
    throw new Error(
      "Failed to get Auth0 API token: " +
        (error.response?.data?.error_description || error.message)
    );
  }
}

// Function to get user info from Auth0
async function getUserInfo(auth0Id) {
  if (!auth0Id) {
    throw new Error("Auth0 ID is required");
  }

  try {
    const token = await getManagementApiToken();

    const response = await axios.get(
      `https://${AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(auth0Id)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user info:",
      error.response?.data || error.message
    );
    throw new Error(
      "Failed to fetch user info: " +
        (error.response?.data?.message || error.message)
    );
  }
}

// Fallback function to handle cases where user info isn't available
function getDefaultUserInfo(auth0Id) {
  return {
    user_id: auth0Id,
    name: "Trip Member",
    nickname: "Member",
    // Add any other default fields you need
  };
}

module.exports = {
  getUserInfo,
  getDefaultUserInfo,
};
