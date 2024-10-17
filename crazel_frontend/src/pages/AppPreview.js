import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './AppPreview.css';

function AppPreview() {
  const location = useLocation();
  const [appName, setAppName] = useState('');
  const [gistUrl, setGistUrl] = useState('');
  const [gistId, setGistId] = useState('');  // Store the extracted Gist ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeId = 'dartpad-preview';

  // Extract appName and gistUrl from the query string
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const appnameParam = params.get('appname');
    const gistUrlParam = params.get('gisturl');

    if (appnameParam) {
      console.log(`App name from query string: ${appnameParam}`);
      setAppName(appnameParam);
    }

    if (gistUrlParam) {
      const decodedGistUrl = decodeURIComponent(gistUrlParam);
      console.log(`Gist URL from query string: ${decodedGistUrl}`);
      setGistUrl(decodedGistUrl);

      // Extract the Gist ID (last part of the URL after the "/")
      const gistIdExtracted = decodedGistUrl.split('/').pop();
      console.log(`Extracted Gist ID: ${gistIdExtracted}`);
      setGistId(gistIdExtracted);

      // Set loading to false since we have the Gist ID and can now display the iframe
      setLoading(false);
    }
  }, [location]);

  // DartPad embed URL with the extracted Gist ID, directly showing the app
  const dartPadEmbedUrl = `https://dartpad.dev/?id=${gistId}&embed=true&run=true&split=100&output-only=true`;

  return (
    <div className="app-preview-container">
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <div className="loading-text">
            Loading the app preview, please wait...
          </div>
        </div>
      ) : (
        <div className="device-frame">
          <iframe
            id={iframeId}
            src={dartPadEmbedUrl}
            width="100%"
            height="600px"
            style={{ border: 'none' }}
            title="App Preview"
          />
        </div>
      )}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default AppPreview;
