import React from 'react';
import { motion } from 'framer-motion';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
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
            <a href="#home" className="nav-link">
              <span className="nav-icon">⌂</span> HOME
            </a>
          </li>
          <li>
            <a href="#about" className="nav-link active">
              <span className="nav-icon">●</span> ABOUT ME
            </a>
          </li>
          <li>
            <a href="#projects" className="nav-link">
              <span className="nav-icon">☰</span> PROJECTS
            </a>
          </li>
          <li>
            <a href="#what-you-get" className="nav-link">
              <span className="nav-icon">✧</span> WHAT YOU GET
            </a>
          </li>
          <li>
            <a href="#services" className="nav-link">
              <span className="nav-icon">⚡</span> SERVICES
            </a>
          </li>
          <li>
            <a href="#clients" className="nav-link">
              <span className="nav-icon">👤</span> CLIENTS
            </a>
          </li>
          <li>
            <a href="#faq" className="nav-link">
              <span className="nav-icon">?</span> FAQ
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
    </aside>
  );
};

export default Sidebar;
