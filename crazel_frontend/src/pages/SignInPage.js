import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import './SignInPage.css'; // Custom CSS for the Sign-In page

const SignInPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate(); // useNavigate hook for navigation

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (isSignUp && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const url = isSignUp ? '/api/register/' : '/api/login/'; // Change API endpoint based on action
    const body = JSON.stringify({ email, password });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    const data = await response.json();
    if (response.ok) {
      navigate('/home'); // Redirect to home page or wherever you want after successful registration/login
    } else {
      alert(data.message || "Something went wrong");
    }
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
        <form onSubmit={handleFormSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {isSignUp && (
            <input
              type="password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
        </form>
        
        {/* Toggle between Sign In and Sign Up */}
        <span className="toggle" onClick={toggleSignUp}>
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </span>
      </div>
    </div>
  );
};

export default SignInPage;
