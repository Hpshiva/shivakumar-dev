import React from 'react';
import { Home, User, Briefcase, Info, Mail } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="navbar-container">
      <div className="nav-top">
        <div className="nav-logo">
          <h2>SHIVA®</h2>
        </div>
        <div className="nav-marquee-wrapper">
          <p className="nav-marquee">
            Working closely with your team to deliver Webflow builds that merge creativity, technical excellence, and long-term value.
          </p>
        </div>
        <div className="nav-actions">
          <a href="#" className="nav-social glass">X</a>
          <a href="#" className="nav-social glass">in</a>
        </div>
      </div>
      
      <div className="nav-main">
        <div className="nav-stats glass">
          <div className="stat-item">
            <span className="stat-number">80+</span>
            <span className="stat-label">Projects</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">7+</span>
            <span className="stat-label">Years of<br/>experience</span>
          </div>
        </div>

        <nav className="nav-menu glass">
          <a href="#home" className="nav-link active">
            <Home size={18} />
            <span className="tooltip">Home</span>
          </a>
          <a href="#about" className="nav-link">
            <User size={18} />
            <span className="tooltip">About me</span>
          </a>
          <a href="#projects" className="nav-link">
            <Briefcase size={18} />
            <span className="tooltip">Projects</span>
          </a>
          <a href="#overview" className="nav-link">
            <Info size={18} />
            <span className="tooltip">What you get</span>
          </a>
          <a href="#contact" className="nav-link">
            <Mail size={18} />
            <span className="tooltip">Contact</span>
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
