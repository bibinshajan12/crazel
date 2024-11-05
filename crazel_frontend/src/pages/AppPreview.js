import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './AppPreview.css';

function AppPreview() {
  const location = useLocation();
  const [appName, setAppName] = useState('');
  const [gistUrl, setGistUrl] = useState('');
  const [suggestion, setSuggestion] = useState(''); // To hold user input for suggestions
  const [llmSuggestedChanges, setLLMSuggestedChanges] = useState(''); // To hold the LLM suggested changes
  const [iframeKey, setIframeKey] = useState(0); // Key to force iframe reload
  const [loading, setLoading] = useState(false); // Loading state
  const [iframeErrors, setIframeErrors] = useState(''); // Hold DartPad iframe errors
  const iframeId = 'dartpad-preview';

  // Extract appName and gistUrl from the query string
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const appnameParam = params.get('appname');
    const gistUrlParam = params.get('gisturl');

    if (appnameParam) {
      setAppName(appnameParam);
    }
    if (gistUrlParam) {
      setGistUrl(decodeURIComponent(gistUrlParam));
    }

    // Listen to messages from DartPad iframe to capture errors
    window.addEventListener('message', handleIframeMessages);

    return () => {
      window.removeEventListener('message', handleIframeMessages);
    };
  }, [location]);

  // Function to handle messages from DartPad iframe
  const handleIframeMessages = (event) => {
    const { data } = event;
    if (data && data.type === 'dartpad-error') {
      setIframeErrors(data.errorMessage); // Capture the error message
      console.log('Error captured from iframe:', data.errorMessage); // Log errors for debugging
    } else {
      console.log('No errors received from iframe'); // Log if no errors are found
    }
  };


  const handleIframeErrors = () => {
    const iframe = document.getElementById(iframeId);
    console.log('camer heree1111');
    iframe.contentWindow.onerror = (message, source, lineno, colno, error) => {
      const errorMessage = `${message} at ${source}:${lineno}:${colno}`;
      setIframeErrors(errorMessage); // Capture iframe error
      console.error('Iframe error:', errorMessage); // Log the error
    };
    iframe.contentWindow.console.error = (...args) => {
      const errorMessage = args.join(' ');
      setIframeErrors(errorMessage); // Capture console error
      console.error('Iframe console error:', errorMessage); // Log the console error
    };
  };
  
  // Call the handleIframeErrors after the iframe loads
  useEffect(() => {
    handleIframeErrors();
  }, [iframeKey]);

  // Function to handle the user's suggestion submission
  const handleSuggestionSubmit = async () => {
    try {
      setLoading(true); // Set loading to true while processing

      // Send suggestion to LLM backend to process and modify the Dart code
      const response = await axios.post('/api/apppreview/suggest-change', {
        app_name: appName,
        changes: suggestion,
        gist_url: gistUrl,
      });

      if (response.data.suggestedChanges) {
        setLLMSuggestedChanges(response.data.suggestedChanges); // Show suggested changes from LLM
      } else {
        console.error('No changes returned from LLM');
      }

      setLoading(false); // End loading
    } catch (error) {
      console.error('Error updating Dart code via LLM:', error);
      setLoading(false); // End loading
    }
  };

  // Function to apply the LLM changes and update the gist
  const applyLLMChanges = async () => {
    try {
      setLoading(true); // Set loading to true while processing

      // Apply the changes to the gist
      const updateResponse = await axios.post('/api/apppreview/update-gist', {
        app_name: appName,
        new_dart_code: llmSuggestedChanges,
        gist_url: gistUrl,
      });

      if (updateResponse.data.gist_url) {
        setGistUrl(updateResponse.data.gist_url); // Update gist URL with the new one
        setIframeKey((prevKey) => prevKey + 1); // Reload the iframe with new Dart code
        setLLMSuggestedChanges(''); // Clear the suggested changes after applying
      }

      setLoading(false); // End loading
    } catch (error) {
      console.error('Error applying LLM changes:', error);
      setLoading(false); // End loading
    }
  };

  // Function to revalidate the code with OpenAI when errors occur
  const revalidateCode = async () => {
    if (!iframeErrors) {
      alert('No errors found to revalidate.');
      return;
    }

    try {
      console.log(iframeErrors)
      setLoading(true); // Set loading to true while processing

      // Fetch the current Dart code from the Gist
      const gistResponse = await axios.get(gistUrl);
      const currentDartCode = gistResponse.data.files['main.dart'].content;

      // Send the error and current Dart code to OpenAI for validation
      const response = await axios.post('/api/apppreview/revalidate-code', {
        app_name: appName,
        current_dart_code: currentDartCode,
        errors: iframeErrors,
      });

      if (response.data.suggestedChanges) {
        setLLMSuggestedChanges(response.data.suggestedChanges); // Show suggested changes from LLM
      } else {
        console.error('No changes returned from LLM');
      }

      setLoading(false); // End loading
    } catch (error) {
      console.error('Error revalidating Dart code via LLM:', error);
      setLoading(false); // End loading
    }
  };

  // DartPad embed URL to show only the output (no code editor)
  const dartPadEmbedUrl = `https://dartpad.dev/embed-flutter.html?run=true&split=0&id=${gistUrl.split('/').pop()}`;

  return (
    <div className="app-preview-container">
      <div className="phone-container">
        <div className="phone-frame">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <div className="loading-text">
                Applying changes, please wait...
              </div>
            </div>
          ) : (
            <iframe
              key={iframeKey}
              id={iframeId}
              src={dartPadEmbedUrl}
              className="phone-iframe"
              title="DartPad Preview"
            />
          )}
        </div>
      </div>

      <div className="suggestion-box">
        <h3>Suggest Changes</h3>
        <textarea
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
          placeholder="Suggest changes to the app..."
        />
        <button onClick={handleSuggestionSubmit} disabled={loading}>
          {loading ? 'Processing...' : 'Submit Changes'}
        </button>

        {llmSuggestedChanges && (
          <div className="llm-suggestions">
            <h4>LLM Suggested Changes</h4>
            <pre>{llmSuggestedChanges}</pre>
            <button onClick={applyLLMChanges} disabled={loading}>
              {loading ? 'Applying Changes...' : 'Apply Changes'}
            </button>
          </div>
        )}

        {/* Revalidate Button */}
        <button onClick={revalidateCode} disabled={loading || !iframeErrors}>
          {loading ? 'Processing...' : 'Revalidate the Code'}
        </button>

        {/* Show the iframe errors if present */}
        {iframeErrors && (
          <div className="error-box">
            <h4>Errors from DartPad</h4>
            <pre>{iframeErrors}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default AppPreview;
