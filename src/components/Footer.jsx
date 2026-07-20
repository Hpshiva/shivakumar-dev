import React from 'react';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <motion.div 
          className="footer-cta"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2>Have an idea?</h2>
          <a href="#" className="btn-huge">Let's talk.</a>
        </motion.div>
        
        <div className="footer-bottom">
          <div className="footer-logo">NESH®</div>
          <div className="footer-links">
            <a href="#">LinkedIn</a>
            <a href="#">Twitter</a>
            <a href="#">Dribbble</a>
            <a href="#">Email</a>
          </div>
          <div className="footer-copy">
            <p>&copy; {new Date().getFullYear()} Nenad Popadić. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
