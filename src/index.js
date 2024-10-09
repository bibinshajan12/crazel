import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Get the root DOM element where the app is mounted
const container = document.getElementById('root');

// Use createRoot from react-dom/client
const root = createRoot(container);

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
