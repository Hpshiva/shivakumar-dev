import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Sidebar.css';

const Sidebar = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    const sections = document.querySelectorAll('section[id], div[id="projects"]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <motion.aside 
      className="sidebar"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
    >
      {/* SHIVA Badge */}
      <div className="sidebar-badge-container">
        <div className="sidebar-badge-shiva">
          SHIVA<sup>®</sup>
        </div>
        <div className="sidebar-badge-socials">
          <a href="#" className="social-icon">𝕏</a>
          <a href="#" className="social-icon">in</a>
        </div>
      </div>
      
      <p className="sidebar-description">
        Working closely with your team to deliver Webflow builds that merge creativity, technical excellence, and long-term value.
      </p>

      {/* Stats row */}
      <div className="sidebar-stats">
        <div className="stat-card">
          <div className="stat-icon logo-mark">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 12.5L7.5 17.5L12 12.5H6.5L11 8H17L12 12.5L16.5 17.5L21.5 12.5H16.5L12 8L7.5 12.5H2.5Z" fill="var(--primary-yellow)"/>
            </svg>
          </div>
          <div className="stat-text">
            <strong>80+</strong>
            <span>Projects</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <span style={{color: 'var(--primary-yellow)', fontSize: '1.5rem', fontWeight: 700}}>7+</span>
          </div>
          <div className="stat-text">
            <strong>Years of</strong>
            <span>experience</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul>
          <li>
            <a href="#home" className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}>
              <span className="nav-icon">{activeSection === 'home' ? '●' : '⌂'}</span> HOME
            </a>
          </li>
          <li>
            <a href="#about" className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}>
              <span className="nav-icon">{activeSection === 'about' ? '●' : '○'}</span> ABOUT ME
            </a>
          </li>
          <li>
            <a href="#projects" className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`}>
              <span className="nav-icon">{activeSection === 'projects' ? '●' : '☰'}</span> PROJECTS
            </a>
          </li>
          <li>
            <a href="#overview" className={`nav-link ${activeSection === 'overview' ? 'active' : ''}`}>
              <span className="nav-icon">{activeSection === 'overview' ? '●' : '✧'}</span> WHAT YOU GET
            </a>
          </li>
          <li>
            <a href="#services" className={`nav-link ${activeSection === 'services' ? 'active' : ''}`}>
              <span className="nav-icon">{activeSection === 'services' ? '●' : '⚡'}</span> SERVICES
            </a>
          </li>
          <li>
            <a href="#clients" className={`nav-link ${activeSection === 'clients' ? 'active' : ''}`}>
              <span className="nav-icon">{activeSection === 'clients' ? '●' : '👤'}</span> CLIENTS
            </a>
          </li>
          <li>
            <a href="#faq" className={`nav-link ${activeSection === 'faq' ? 'active' : ''}`}>
              <span className="nav-icon">{activeSection === 'faq' ? '●' : '?'}</span> FAQ
            </a>
          </li>
        </ul>
      </nav>

      {/* Clients Logos Mini */}
      <div className="sidebar-clients-mini">
        <div className="client-logo-mini">INVERT</div>
        <div className="client-logo-mini">SemiconBio</div>
        <div className="client-logo-mini">CURA</div>
      </div>

      {/* Contact Actions */}
      <div className="sidebar-actions">
        <button className="email-copy-btn">
          nenad@popadic.co
          <span className="copy-icon">⎘</span>
        </button>
        <button className="book-call-btn hover-target">
          Book a Call
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
