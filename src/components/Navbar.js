import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaBars, FaHome, FaInfoCircle, FaSignInAlt, FaTag, FaCog } from 'react-icons/fa'; // Importing icons

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
  width: ${({ isOpen }) => (isOpen ? '250px' : '60px')}; /* Collapsed width */
  z-index: 1000;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.5);
  transition: width 0.3s ease; /* Smooth transition */
  overflow: hidden; /* Prevent text overflow */
`;

const Logo = styled(Link)`
  color: #00aaff;
  font-size: 1.8rem;
  font-weight: bold;
  text-decoration: none;
  margin-bottom: 2rem;
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')}; /* Hide the logo when collapsed */
  transition: opacity 0.3s ease;
  white-space: nowrap; /* Prevent text wrapping */
`;

const Menu = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const MenuItem = styled.li`
  display: flex;
  align-items: center;
  gap: 1rem;
  white-space: nowrap; /* Prevent text wrapping */
`;

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

  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    left: 0;
    bottom: 0;
    background-color: #00aaff;
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 100%;
  }
`;

const IconContainer = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'none' : 'block')}; /* Show only when collapsed */
  color: white; /* Set icon color to white */
  font-size: 2rem;
  text-align: center;
  width: 100%;
  cursor: pointer;
`;

const Icon = styled.div`
  font-size: ${({ isOpen }) => (isOpen ? '1.rem' : '1.5rem')}; /* Bigger icon when collapsed */
  transition: font-size 0.3s ease; /* Smooth transition for icon size */
  display: flex;
  justify-content: ${({ isOpen }) => (isOpen ? 'flex-start' : 'center')}; /* Align icon to the left when collapsed */
  width: ${({ isOpen }) => (isOpen ? 'auto' : '100%')}; /* Take full width in collapsed state */
  padding-left: ${({ isOpen }) => (isOpen ? '0' : '10px')}; /* Adjust padding when closed */
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarContainer
      isOpen={isOpen}
      onMouseEnter={() => setIsOpen(true)} // Expand when mouse enters
      onMouseLeave={() => setIsOpen(false)} // Collapse when mouse leaves
    >
      <IconContainer isOpen={isOpen}>
        <FaBars /> {/* Icon for collapsed state */}
      </IconContainer>
      <Logo to="/" isOpen={isOpen}>
        Crazel
      </Logo>
      <Menu>
        <MenuItem>
          <Icon isOpen={isOpen}><FaHome style={{ color: 'white' }} /></Icon> {/* Home icon */}
          <MenuLink to="/" isOpen={isOpen}>Home</MenuLink>
        </MenuItem>
        <MenuItem>
          <Icon isOpen={isOpen}><FaTag style={{ color: 'white' }} /></Icon> {/* Features icon */}
          <MenuLink to="/features" isOpen={isOpen}>Features</MenuLink>
        </MenuItem>
        <MenuItem>
          <Icon isOpen={isOpen}><FaCog style={{ color: 'white' }} /></Icon> {/* Pricing icon */}
          <MenuLink to="/pricing" isOpen={isOpen}>Pricing</MenuLink>
        </MenuItem>
        <MenuItem>
          <Icon isOpen={isOpen}><FaInfoCircle style={{ color: 'white' }} /></Icon> {/* About Us icon */}
          <MenuLink to="/about" isOpen={isOpen}>About Us</MenuLink>
        </MenuItem>
        <MenuItem>
          <Icon isOpen={isOpen}><FaSignInAlt style={{ color: 'white' }} /></Icon> {/* Sign In icon */}
          <MenuLink to="/signin" isOpen={isOpen}>Sign In</MenuLink>
        </MenuItem>
      </Menu>
    </SidebarContainer>
  );
};

export default Navbar;
