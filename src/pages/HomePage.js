import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HomePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #141414;
  color: white;
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  color: white;
  margin-bottom: 2rem;
`;

const TileButton = styled(Link)`
  padding: 1rem 2rem;
  background-color: #00aaff;
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  border-radius: 5px;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
    background-color: #008fcc;
  }
`;

const Footer = styled.footer`
  position: absolute;
  bottom: 20px;
  text-align: center;
  width: 100%;
  color: #999;
`;

const HomePage = () => {
  return (
    <HomePageContainer>
      <Title
        initial={{ y: -200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          CRAZEL
        </motion.span>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
           
        </motion.span>
      </Title>
      <TileButton to="/chat">Start Building Your App</TileButton>
      <Footer>
        <p>&copy; 2024 Crazel - Privacy Policy - Terms of Service</p>
      </Footer>
    </HomePageContainer>
  );
};

export default HomePage;
