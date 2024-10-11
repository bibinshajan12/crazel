import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Import your global CSS
import App from './App';

// Update the document title when the app loads
document.title = 'Crazel'; // Set the title of the app to "Crazel"


// Get the root DOM element where the app is mounted
const container = document.getElementById('root');

// Use createRoot from react-dom/client to render the app
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
