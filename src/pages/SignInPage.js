import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const SignInContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #141414;
  color: white;
`;

const SignInBox = styled(motion.div)`
  background-color: #1f1f1f;
  padding: 3rem;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 170, 255, 0.2);
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const Title = styled(motion.h1)`
  font-size: 2.5rem;
  color: #00aaff;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  background-color: #2c2c2c;
  border: none;
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  color: #ffffff;
  font-size: 1rem;
  border-radius: 5px;
  width: 100%;
  transition: background-color 0.3s ease;
  &:focus {
    background-color: #333;
    outline: none;
  }
`;

const Button = styled(motion.button)`
  background-color: #00aaff;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  font-size: 1.2rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  width: 100%;
  margin-top: 1.5rem;

  &:hover {
    background-color: #008fcc;
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
  }
`;

const ToggleButton = styled(motion.span)`
  margin-top: 1rem;
  font-size: 1rem;
  color: #00aaff;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const SignInPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <SignInContainer>
      <SignInBox
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        <Title
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {isSignUp ? 'Create Account' : 'Sign In'}
        </Title>
        
        <form>
          <Input type="email" placeholder="Email" required />
          <Input type="password" placeholder="Password" required />
          {isSignUp && (
            <Input
              type="password"
              placeholder="Confirm Password"
              required
            />
          )}
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>

        <ToggleButton
          whileHover={{ scale: 1.1 }}
          onClick={toggleSignUp}
        >
          {isSignUp
            ? 'Already have an account? Sign In'
            : "Don't have an account? Sign Up"}
        </ToggleButton>
      </SignInBox>
    </SignInContainer>
  );
};

export default SignInPage;
