import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatbotPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import Sidebar from './components/Navbar';
import TemplatesPage from './pages/TemplatesPage'; 
import SigninPage from './pages/SignInPage';
import './App.css';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(250); // Default sidebar width when expanded

  // Dynamically adjust the sidebar width when collapsed/expanded
  useEffect(() => {
    if (isSidebarCollapsed) {
      setSidebarWidth(0); // Fully collapse the sidebar
    } else {
      setSidebarWidth(250); // Expanded width
    }
  }, [isSidebarCollapsed]);

  return (
    <Router>
      <div className="app-layout">
        <Navbar />
        <div className="main-content" style={{ marginLeft: `${sidebarWidth}px` }}>
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/templates" element={<TemplatesPage />} /> 
              <Route path="/about" element={<AboutPage />} />
              <Route path="/signin" element={<SigninPage />} /> 
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
