import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const handleExternalLink = (path) => {
    window.open(`https://flightsnapp.com${path}`, '_blank');
  };

  return (
    <footer className="sticky-footer">
      <a onClick={() => navigate('/privacy-policy')}>Privacy Policy</a> |
      <a onClick={() => navigate('/terms-of-service')}>Terms of Service</a> |
      <a onClick={() => navigate('/snapp-stars-policy')}>Snapp Stars Program</a> |
      <a onClick={() => navigate('/personas')}>Persona Profiles</a> |
      <a onClick={() => navigate('/vision')}>Vision</a> |
      <a onClick={() => navigate('/team')}>Team</a>
    </footer>
  );
};

export default Footer;
