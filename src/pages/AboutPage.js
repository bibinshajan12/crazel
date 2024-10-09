import React from 'react';
import './AboutPage.css';
import { FaRobot, FaCode, FaEye, FaCloudUploadAlt, FaPalette, FaShieldAlt } from 'react-icons/fa'; // Import icons
import BibinImage from '../assets/images/bibin.jpeg'; // Import Bibin's image
import VarunImage from '../assets/images/varun.jpeg'; // Import Varun's image

const AboutPage = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Us</h1>
      </div>

      <div className="team-section">
        <h2>Meet Our Team</h2>

        <div className="team-member">
        <img src={BibinImage} alt="Bibin Shajan" className="team-photo" /> {/* Bibin's image */}
          <div className="team-info">
            <h3>Bibin Shajan, CEO</h3>
            <p>
              Bibin Shajan is a visionary leader with a passion for pushing the boundaries of cloud computing and AI.
              With years of experience as a Cloud Solution Architect and Software Engineering Lead, Bibin has a proven 
              track record of driving technological innovation and delivering tangible results across diverse industries. 
              He founded Crazel with the belief that app development should be accessible to everyone, regardless of technical skills.
            </p>
          </div>
        </div>

        <div className="team-member">
          <div className="team-photo-placeholder" /> {/* Placeholder for Varun's image */}
          <div className="team-info">
            <h3>Varun, CTO</h3>
            <p>
              Varun is a seasoned Software Engineer with a rich background in developing innovative solutions across a variety of industries, 
              including the fine arts sector. As the Chief Technology Officer of Crazel, Varun brings his deep expertise in full-stack development 
              to lead the platform's technological vision and strategy. At Crazel, Varun plays a pivotal role in ensuring the seamless integration 
              of AI-driven features, enhancing the no-code platform’s ability to help users create and deploy mobile apps with ease.
            </p>
          </div>
        </div>

        <div className="team-member">
          <div className="team-photo-placeholder" /> {/* Placeholder for Athira's image */}
          <div className="team-info">
            <h3>Athira, CFO</h3>
            <p>
              Athira, a senior Business Analyst and a Masters holder in data science, has over 10 years of experience in the IT industry. 
              Her expertise spans data science, finance, and business strategy. At Crazel, Athira oversees financial strategy, helping 
              to ensure the company's continued growth and success.
            </p>
          </div>
        </div>
      </div>

      <div className="history-section">
        <h2>Our History</h2>
        <div className="history-content">
          <p>
            Our journey began with a simple yet powerful idea: to make app development accessible to everyone, regardless of their technical skills. 
            As tech enthusiasts, we witnessed countless entrepreneurs, small business owners, and creators face roadblocks in turning their app ideas 
            into reality due to the complexity and high cost of development. This inspired the creation of Crazel, a platform designed to empower anyone 
            to build, customize, and deploy mobile apps effortlessly. Our vision was clear from the start—to remove the technical barriers and provide a tool 
            that transforms creativity into functional mobile applications without the need for coding expertise.
          </p>
          <div className="history-image-placeholder" /> {/* Placeholder for an image */}
        </div>
      </div>

      <div className="approach-section">
        <h2>Our Approach</h2>
        <div className="approach-content">
          <p>
            At Crazel, we believe that app development should be as easy as having a conversation. This led us to integrate AI into our platform, 
            creating a chatbot that intelligently guides users through the entire app-building process. Users simply describe their app idea, 
            and the AI-powered chatbot handles the rest—asking questions, offering suggestions, and translating the conversation into fully 
            functional app components.
          </p>
          <div className="approach-image-placeholder" /> {/* Placeholder for an image */}
        </div>
      </div>

      <div className="services-section">
        <h2>Our Services</h2>
        <div className="services-grid">
          <div className="service-tile">
            <FaRobot className="service-icon" /> {/* AI-Powered Chatbot Icon */}
            <h3>AI-Powered Chatbot</h3>
            <p>Guides you through the app-building process with ease, turning your ideas into a functional app.</p>
          </div>
          <div className="service-tile">
            <FaCode className="service-icon" /> {/* No-Code Development Icon */}
            <h3>No-Code Development</h3>
            <p>Create your app without writing a single line of code, perfect for non-developers and professionals alike.</p>
          </div>
          <div className="service-tile">
            <FaEye className="service-icon" /> {/* Real-Time App Preview Icon */}
            <h3>Real-Time App Preview</h3>
            <p>See live updates of your app as you build, ensuring everything works the way you want it to.</p>
          </div>
          <div className="service-tile">
            <FaCloudUploadAlt className="service-icon" /> {/* App Deployment Icon */}
            <h3>App Deployment</h3>
            <p>Deploy your app to the App Store or Google Play Store with a single click.</p>
          </div>
          <div className="service-tile">
            <FaPalette className="service-icon" /> {/* Customization Options Icon */}
            <h3>Customization Options</h3>
            <p>Tailor your app’s design and features to suit your unique needs and brand identity.</p>
          </div>
          <div className="service-tile">
            <FaShieldAlt className="service-icon" /> {/* Security Features Icon */}
            <h3>Security Features</h3>
            <p>Ensure your apps are secure and comply with industry standards, protecting user data and privacy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
