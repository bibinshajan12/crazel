// src/authConfig.js

export const msalConfig = {
    auth: {
      clientId: '70a781ac-1e67-4b2c-944e-654a3ea68266', // Replace with your Azure AD app's client ID
      authority: 'https://login.microsoftonline.com/85ff794e-d3c3-48b4-b1ef-b6b46758624f', // Replace with your tenant ID
      redirectUri: 'http://localhost:3000', // Your redirect URI
    },
    cache: {
      cacheLocation: 'localStorage', // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set to true if you're having issues on IE11 or Edge
    },
  };
  
  export const loginRequest = {
    scopes: ['User.Read'], // Scopes required for your app
  };
  