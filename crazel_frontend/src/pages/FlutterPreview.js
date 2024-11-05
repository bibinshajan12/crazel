import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './FlutterPreview.css';

function FlutterPreview() {
  const location = useLocation();
  const [appName, setAppName] = useState('');
  const [flutterProjectUrl, setFlutterProjectUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract appName and projectUrl from the query string
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const appnameParam = params.get('appname');
    const projectUrlParam = params.get('projecturl');

    if (appnameParam) setAppName(appnameParam);
    if (projectUrlParam) setFlutterProjectUrl(decodeURIComponent(projectUrlParam));
  }, [location]);

  // Handle iframe load and error events
  const handleIframeLoad = () => setLoading(false);
  const handleIframeError = () => {
    setLoading(false);
    setError("Failed to load the Flutter app. Please check the URL and try again.");
  };

  return (
    <div className="flutter-preview-container">
      <div className="phone-container">
        <div className="phone-frame">
          {loading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <div className="loading-text">Loading the app, please wait...</div>
            </div>
          )}
          {error && <div className="error-text">{error}</div>}
          {flutterProjectUrl && !error && (
            <iframe
              src={flutterProjectUrl}
              className="phone-iframe"
              title="Flutter Preview"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: loading ? 'none' : 'block'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default FlutterPreview;
