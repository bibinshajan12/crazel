import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './AppPreview.css';

const AppPreview = () => {
    const location = useLocation();
    const [appname, setAppName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        // Extract the 'appname' from the URL query parameter
        const queryParams = new URLSearchParams(location.search);
        const appnameParam = queryParams.get('appname');
        if (appnameParam) {
            setAppName(appnameParam);
        }
    }, [location]);

    const handleBuildAndPreview = async () => {
        setLoading(true);
        setError('');

        try {
            // Trigger the Flutter build process via the backend
            const response = await axios.get(`/api/apppreview/view/${appname}/`);
            console.log('call is here 1')
            if (response.status === 200) {
                console.log('call is here 2')
                // Set the preview URL to load the Flutter app in an iframe after a successful build
                const cacheBustingParam = `?t=${new Date().getTime()}`;
                setPreviewUrl(`http://localhost:8000/api/apppreview/serveflutterapp/${appname}/${cacheBustingParam}`);
            } else {
                setError('Failed to build the app. Please try again.');
            }
        } catch (e) {
            setError('Failed to build or preview the app. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-preview-container">
            <h2>App Preview for {appname}</h2>
            <button onClick={handleBuildAndPreview} disabled={loading}>
                {loading ? 'Building...' : 'Build and Preview App'}
            </button>
            {error && <p className="error-message">{error}</p>}
            {previewUrl && (
                <iframe
                    title="Flutter App Preview"
                    src={previewUrl}
                    className="app-preview-iframe"
                ></iframe>
            )}
        </div>
    );
};

export default AppPreview;
