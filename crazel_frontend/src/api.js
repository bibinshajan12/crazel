// src/api.js

import { useMsal } from '@azure/msal-react';

function callApi(endpoint) {
  const { instance, accounts } = useMsal();

  const request = {
    ...loginRequest,
    account: accounts[0],
  };

  instance.acquireTokenSilent(request).then((response) => {
    fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${response.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Handle data
      });
  });
}
