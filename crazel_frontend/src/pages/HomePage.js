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
  overflow: hidden; /* To prevent scrollbars when animating elements off-screen */
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  color: #00aaff;
  margin-bottom: 2rem;
  text-align: center;
  letter-spacing: 3px;
  line-height: 1.2;
`;

const SubTitle = styled(motion.h2)`
  font-size: 2rem;
  color: #f0f0f0;
  margin-bottom: 3rem;
  text-align: center;
  font-weight: 300;
`;

const TileButton = styled(Link)`
  padding: 1rem 2.5rem;
  background-color: #00aaff;
  color: white;
  font-size: 1.5rem;
  text-decoration: none;
  border-radius: 50px;
  transition: transform 0.3s ease, background-color 0.3s ease;
  box-shadow: 0 8px 15px rgba(0, 170, 255, 0.3);
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
    background-color: #008fcc;
    box-shadow: 0 10px 20px rgba(0, 170, 255, 0.5);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 3rem;
`;

const GlowingCircle = styled(motion.div)`
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(0, 170, 255, 0.6), transparent);
  position: absolute;
  border-radius: 50%;
  z-index: -1;
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
      {/* Glowing Circle Effects */}
      <GlowingCircle
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
        }}
      />
      <Title
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        CRAZEL
      </Title>
      <SubTitle
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.5 }}
      >
        Bringing Your App Ideas to Life
      </SubTitle>
      <ButtonContainer>
        <TileButton to="/chat">Start Building Your App</TileButton>
        <TileButton to="/features">Explore Features</TileButton>
        <TileButton to="/flutter-preview?appname=snakeandladderdemo&projecturl=%2Fsnakeandladderdemo%2Fweb%2F">
          Sample App for preview
        </TileButton>
      </ButtonContainer>
      <Footer>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          &copy; 2024 Crazel - Privacy Policy - Terms of Service
        </motion.p>
      </Footer>
    </HomePageContainer>
  );
};

export default HomePage;
