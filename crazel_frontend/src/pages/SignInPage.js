import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import './SignInPage.css'; // Custom CSS for the Sign-In page

const SignInPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate(); // useNavigate hook for navigation

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
  };

  const navigateToChatbot = () => {
    navigate('/chat'); // Redirect to ChatbotPage on "Try for Free"
  };

  // Initialize Particle Animation
  const particlesInit = async (main) => {
    await loadFull(main); // Load full tsparticles features
  };

  return (
    <div className="sign-in-page">
      {/* Particle effect for the background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: "#141414", // Background color
          },
          particles: {
            color: { value: "#00aaff" }, // Particle color
            number: { value: 100 }, // Number of particles
            size: { value: 3 }, // Particle size
            move: { enable: true, speed: 1.5 }, // Particle movement speed
            links: {
              enable: true,
              color: "#00aaff", // Line color between particles
              distance: 150,
            },
          },
        }}
      />

      {/* Sign In or Sign Up form */}
      <div className="sign-in-container">
        <h1>{isSignUp ? 'Create Account' : 'Sign In'}</h1>
        <form>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          {isSignUp && (
            <input
              type="password"
              placeholder="Confirm Password"
              required
            />
          )}
          <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
        </form>
        
        {/* Try for Free Button */}
        <button className="try-for-free-button" onClick={navigateToChatbot}>
          Try for Free
        </button>
        
        {/* Toggle between Sign In and Sign Up */}
        <span className="toggle" onClick={toggleSignUp}>
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </span>
      </div>
    </div>
  );
};

export default SignInPage;
