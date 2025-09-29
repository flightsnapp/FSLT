import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleNavClick = (path) => {
    if (path.startsWith('/')) {
      navigate(path);
    } else {
      window.open(path);
    }
  };

  return (
    <motion.header
      className="sticky-header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="header-content">
        <motion.div
          className="logo-header"
          animate={{ textShadow: "0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FF7F" }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <h1>Flightsnapp</h1>
        </motion.div>
        <nav>
          <div className="nav-links">
            <a href="#" className="hidden" id="dashboard-link" onClick={() => handleNavClick('/dashboard')}>Dashboard</a>
          </div>
        </nav>
        <motion.div
          className="social-icons"
          whileHover={{ scale: 1.05 }}
        >
        <motion.a
          href="https://twitter.com/share?text=Discover%20your%20travel%20persona%20with%20Flightsnapp!%20%23TravelPersona"
          target="_blank"
          whileHover={{ scale: 1.2, rotate: -10 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <i className="fab fa-x-twitter"></i>
        </motion.a>
        <motion.a
          href="https://www.facebook.com/sharer/sharer.php?u=https://flightsnapp.com"
          target="_blank"
          whileHover={{ scale: 1.2, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <i className="fab fa-facebook"></i>
        </motion.a>
        <motion.a
          onClick={() => navigator.clipboard.writeText("Discover your travel persona with Flightsnapp! #TravelPersonaQuiz")}
          whileHover={{ scale: 1.2, rotate: -10 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{ cursor: 'pointer' }}
        >
          <i className="fab fa-instagram"></i>
        </motion.a>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
