// src/components/LogoutButton.js

import React from 'react';
import { useMsal } from '@azure/msal-react';

function LogoutButton() {
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutPopup().catch((e) => {
      console.error(e);
    });
  };

  return <button onClick={handleLogout}>Sign Out</button>;
}

export default LogoutButton;
