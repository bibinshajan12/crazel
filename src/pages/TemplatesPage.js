import React from 'react';
import styled from 'styled-components';
import { FaMobileAlt, FaShoppingCart, FaUserTie, FaHeartbeat } from 'react-icons/fa'; // Import icons

const TemplatesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #141414;
  color: white;
  min-height: 100vh;
`;

const Header = styled.h1`
  font-size: 2.5rem;
  color: #00aaff;
  margin-bottom: 2rem;
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
`;

const TemplateCard = styled.div`
  background-color: #1f1f1f;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 6px 16px rgba(0, 170, 255, 0.3);
  }
`;

const Icon = styled.div`
  font-size: 3rem;
  color: #00aaff;
  margin-bottom: 1rem;
`;

const TemplateTitle = styled.h2`
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 1rem;
`;

const TemplateDescription = styled.p`
  font-size: 1.1rem;
  color: #cccccc;
`;

const TemplateButton = styled.a`
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #00aaff;
  color: white;
  text-decoration: none;
  font-size: 1rem;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #008fcc;
  }
`;

const TemplatesPage = () => {
  return (
    <TemplatesContainer>
      <Header>Apps you can build with Crazel</Header>
      <TemplateGrid>
        <TemplateCard>
          <Icon><FaMobileAlt /></Icon>
          <TemplateTitle>Mobile Business App</TemplateTitle>
          <TemplateDescription>
            A complete business app to manage your services, appointments, and clients. Perfect for entrepreneurs.
          </TemplateDescription>
          <TemplateButton href="#">Preview Template</TemplateButton>
        </TemplateCard>

        <TemplateCard>
          <Icon><FaShoppingCart /></Icon>
          <TemplateTitle>E-Commerce App</TemplateTitle>
          <TemplateDescription>
            Set up your online store with features like product listings, shopping carts, and secure payments.
          </TemplateDescription>
          <TemplateButton href="#">Preview Template</TemplateButton>
        </TemplateCard>

        <TemplateCard>
          <Icon><FaUserTie /></Icon>
          <TemplateTitle>Consultant Profile App</TemplateTitle>
          <TemplateDescription>
            Showcase your professional services and portfolio with this sleek and modern consultant app template.
          </TemplateDescription>
          <TemplateButton href="#">Preview Template</TemplateButton>
        </TemplateCard>

        <TemplateCard>
          <Icon><FaHeartbeat /></Icon>
          <TemplateTitle>Healthcare Booking App</TemplateTitle>
          <TemplateDescription>
            A healthcare app designed to let patients book appointments with doctors and manage their records.
          </TemplateDescription>
          <TemplateButton href="#">Preview Template</TemplateButton>
        </TemplateCard>
      </TemplateGrid>
    </TemplatesContainer>
  );
};

export default TemplatesPage;
