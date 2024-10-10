import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaBars, FaHome, FaInfoCircle, FaSignInAlt, FaTag, FaCog, FaMobileAlt } from 'react-icons/fa'; // Importing icons

// Sidebar container with dynamic width
const SidebarContainer = styled.nav`
  background-color: #141414;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${({ isOpen }) => (isOpen ? '250px' : '140px')}; /* Collapsed width */
  z-index: 1000;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.5);
  transition: width 0.3s ease; /* Smooth transition */
  overflow: hidden; /* Prevent text overflow */
`;

// Container for logo and toggle icon to align them on the same line
const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  width: 100%;
`;

// Logo styling, hiding when the sidebar is collapsed
const Logo = styled(Link)`
  color: #00aaff;
  font-size: 1.8rem;
  font-weight: bold;
  text-decoration: none;
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')}; /* Hide the logo when collapsed */
  transition: opacity 0.3s ease;
  white-space: nowrap; /* Prevent text wrapping */
`;

// Menu container
const Menu = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

// Menu item with icons and links
const MenuItem = styled.li`
  display: flex;
  align-items: center;
  gap: 1rem;
  white-space: nowrap; /* Prevent text wrapping */
`;

// Styling for menu links
const MenuLink = styled(Link)`
  color: white; /* Set icon and text color to white */
  text-decoration: none;
  padding: 0.5rem 1rem;
  width: 100%;
  display: flex;
  align-items: center;
  transition: color 0.3s ease, background-color 0.3s ease, opacity 0.3s ease;
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')}; /* Hide the text when collapsed */
  overflow: hidden; /* Hide text overflow when collapsed */
  white-space: nowrap; /* Prevent text wrapping */

  &:hover {
    color: #00aaff;
    background-color: rgba(0, 170, 255, 0.1); /* Subtle background on hover */
  }
`;

// Icon container to adjust size and alignment
const IconContainer = styled.div`
  color: white;
  font-size: ${({ isOpen }) => (isOpen ? '1.5rem' : '2rem')}; /* Adjust icon size based on open state */
  text-align: center;
  cursor: pointer;
  display: flex;
  justify-content: ${({ isOpen }) => (isOpen ? 'flex-start' : 'center')}; /* Align icon to center when collapsed */
  padding-left: ${({ isOpen }) => (isOpen ? '10px' : '0')}; /* Adjust padding when open or closed */
  transition: font-size 0.3s ease;
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarContainer
      isOpen={isOpen}
      onMouseEnter={() => setIsOpen(true)} // Expand when mouse enters
      onMouseLeave={() => setIsOpen(false)} // Collapse when mouse leaves
    >
      {/* Header container to align toggle icon and logo */}
      <HeaderContainer>
        <IconContainer isOpen={isOpen}>
          <FaBars onClick={() => setIsOpen(!isOpen)} /> {/* Toggle icon */}
        </IconContainer>
        <Logo to="/" isOpen={isOpen}>
          Crazel
        </Logo>
      </HeaderContainer>

      {/* Menu items with icons */}
      <Menu>
        <MenuItem>
          <IconContainer isOpen={isOpen}><FaHome style={{ color: 'white' }} /></IconContainer> {/* Home icon */}
          <MenuLink to="/" isOpen={isOpen}>Home</MenuLink>
        </MenuItem>
        <MenuItem>
          <IconContainer isOpen={isOpen}><FaTag style={{ color: 'white' }} /></IconContainer> {/* Features icon */}
          <MenuLink to="/features" isOpen={isOpen}>Features</MenuLink>
        </MenuItem>
        <MenuItem>
          <IconContainer isOpen={isOpen}><FaMobileAlt style={{ color: 'white' }} /></IconContainer>
          <MenuLink to="/templates" isOpen={isOpen}>Templates</MenuLink>
        </MenuItem>
        <MenuItem>
          <IconContainer isOpen={isOpen}><FaCog style={{ color: 'white' }} /></IconContainer> {/* Pricing icon */}
          <MenuLink to="/pricing" isOpen={isOpen}>Pricing</MenuLink>
        </MenuItem>
        <MenuItem>
          <IconContainer isOpen={isOpen}><FaInfoCircle style={{ color: 'white' }} /></IconContainer> {/* About Us icon */}
          <MenuLink to="/about" isOpen={isOpen}>About Us</MenuLink>
        </MenuItem>
        <MenuItem>
          <IconContainer isOpen={isOpen}><FaSignInAlt style={{ color: 'white' }} /></IconContainer> {/* Sign In icon */}
          <MenuLink to="/signin" isOpen={isOpen}>Sign In</MenuLink>
        </MenuItem>
      </Menu>
    </SidebarContainer>
  );
};

export default Navbar;
