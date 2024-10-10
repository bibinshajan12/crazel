import React, { useState, useEffect } from 'react';
import './SignInPage.css';

const SignInPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
  };

  useEffect(() => {
    // Trigger the Matrix animation
    initMatrixEffect();
  }, []);

  // Matrix Effect function inside the component
  const initMatrixEffect = () => {
    const canvas = document.getElementById('matrix');
    const ctx = canvas.getContext('2d');

    // Set the canvas width and height to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Characters to display (Matrix characters but in blue)
    const matrixChars = 'CRAZELBIBIN123456789@#$%^&*()*&^%';
    const fontSize = 16;
    const columns = canvas.width / fontSize; // Number of columns based on canvas width

    const drops = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = 1; // Starting point of each column
    }

    // Function to draw the matrix effect
    const drawMatrix = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Slightly transparent background for fade effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00aaff'; // Blue text color
      ctx.font = `${fontSize}px arial`;

      // Loop over the columns and draw the characters
      for (let i = 0; i < drops.length; i++) {
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Randomly reset the drop to create a flowing effect
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    setInterval(drawMatrix, 30); // Draw every 30 milliseconds
  };

  return (
    <div className="matrix-background">
      <div className="sign-in-container">
        <h1>{isSignUp ? 'Create Account' : 'Sign In'}</h1>
        <form>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          {isSignUp && (
            <input type="password" placeholder="Confirm Password" required />
          )}
          <button>{isSignUp ? 'Sign Up' : 'Sign In'}</button>
        </form>
        <span className="toggle" onClick={toggleSignUp}>
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </span>
      </div>
      <canvas id="matrix"></canvas> {/* Canvas for matrix background */}
    </div>
  );
};

export default SignInPage;
