// src/components/LoginButton.js

import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';

function LoginButton() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch((e) => {
      console.error(e);
    });
  };

  return <button onClick={handleLogin}>Sign In</button>;
}

export default LoginButton;
