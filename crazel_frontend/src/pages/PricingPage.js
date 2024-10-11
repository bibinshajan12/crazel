import React from 'react';
import './PricingPage.css';

const PricingPage = () => {
  const handleContactUs = () => {
    window.location.href = 'mailto:support@crazelapp.com?subject=Pricing Inquiry';
  };

  return (
    <div className="pricing-container">
      <div className="pricing-header">
        <h1>Crazel Pricing</h1>
        <p>
          Currently, Crazel is free for all users as part of our beta testing phase. Once we officially launch, you'll be able to enjoy premium features in our pricing tiers.
        </p>
      </div>
      
      <div className="tiers-section">
        <div className="tier">
          <h2>👤 Individual</h2>
          <p><strong>Free</strong> during beta</p>
          <ul>
            <li>Access to the Crazel platform</li>
            <li>Limited app deployment (up to 2 apps)</li>
            <li>Basic support</li>
          </ul>
        </div>

        <div className="tier">
          <h2>🛠️ Beginner</h2>
          <p><strong>Free</strong> during beta</p>
          <ul>
            <li>All Individual features</li>
            <li>Access to app templates</li>
            <li>Advanced app customization options</li>
            <li>Priority support</li>
          </ul>
        </div>

        <div className="tier">
          <h2>🏢 Business</h2>
          <p><strong>Free</strong> during beta</p>
          <ul>
            <li>All Beginner features</li>
            <li>Unlimited app deployment</li>
            <li>Team collaboration features</li>
            <li>Dedicated account manager</li>
            <li>Enhanced security and compliance</li>
          </ul>
        </div>
      </div>

      <div className="premium-message">
        <p>
          <em>When the premium version launches, enjoy even more benefits, such as custom integrations, extended analytics, and exclusive templates. Stay tuned!</em>
        </p>
      </div>

      <div className="contact-section">
        <button className="contact-button" onClick={handleContactUs}>Contact Us</button>
      </div>
    </div>
  );
};

export default PricingPage;
