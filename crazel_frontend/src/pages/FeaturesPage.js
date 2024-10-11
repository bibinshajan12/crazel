import React from 'react';
import './FeaturesPage.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const FeaturesPage = () => {
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleGetStartedClick = () => {
    navigate('/chat'); // Navigate to the chatbot screen
  };

  return (
    <div className="features-container">
      <div className="features-header">
        <h1>Unleash Your Creativity with Crazel</h1>
        <p>Building apps has never been this easy, intuitive, and fun.</p>
      </div>
      
      <div className="features-section">
        <div className="feature">
          <h2>👨‍💻 No-Code Platform</h2>
          <p>
            Crazel empowers creators and developers alike with a robust no-code platform. Whether you're a tech-savvy individual or a complete beginner, you can build your dream app with just a few clicks.
          </p>
        </div>

        <div className="feature">
          <h2>⚡ Fast App Deployment</h2>
          <p>
            Launch your app to the App Store or Play Store faster than ever. Crazel handles all the heavy lifting with seamless deployment tools, so you can focus on what matters—your app.
          </p>
        </div>

        <div className="feature">
          <h2>🎨 Stunning Visual Design</h2>
          <p>
            Create beautiful, responsive, and fluidic app designs that cater to every demographic. Crazel offers customizable templates, themes, and design options to ensure your app looks stunning on every device.
          </p>
        </div>

        <div className="feature">
          <h2>💡 Intelligent AI Assistance</h2>
          <p>
            With Crazel’s AI-powered chatbot assistant, ideate, refine, and bring your app concepts to life. The AI guides you through the process of app creation and deployment, making app development more accessible than ever.
          </p>
        </div>

        <div className="feature">
          <h2>📊 Real-Time Preview</h2>
          <p>
            See your app evolve in real time. The Crazel platform provides you with a live preview of your app, allowing you to make instant design and feature adjustments while maintaining complete control over the final product.
          </p>
        </div>

        <div className="feature">
          <h2>🔒 Secure and Scalable</h2>
          <p>
            Built on cutting-edge technology, Crazel ensures that your apps are secure and scalable. Whether you’re targeting 100 or 1 million users, Crazel provides the infrastructure to support your growth.
          </p>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Build?</h2>
        <p>Join hundreds of creators who have built their dream apps with Crazel. Let’s make something amazing together.</p>
        <button className="cta-button" onClick={handleGetStartedClick}>Get Started with Crazel</button>
      </div>
    </div>
  );
};

export default FeaturesPage;
