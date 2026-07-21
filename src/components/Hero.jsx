import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Hero.css';

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Parallax values
  const logoY = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 250]);

  // Initial text reveal variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className="hero-section" id="hero" ref={ref}>
      <div className="hero-container">
        {/* Background SHIVA Logo with Parallax */}
        <motion.div className="hero-logo-bg" style={{ y: logoY }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 1288 338" fill="none" className="nesh-logo-svg">
            <path d="M0,4 H246.64 V191 H75.36 V268 H246.64 V323 H0 V136 H171.28 V59 H0 Z" fill="#F4FF15"></path>
            <path d="M301.45,4 H376.81 V136 H472.72 V4 H548.09 V323 H472.72 V191 H376.81 V323 H301.45 Z" fill="#F4FF15"></path>
            <path d="M602.89,4 H685.11 V323 H602.89 Z" fill="#F4FF15"></path>
            <path d="M739.91,4 L822.13,323 H904.34 L986.55,4 H904.34 L863.23,180 L822.13,4 Z" fill="#F4FF15"></path>
            <path d="M1041.36,323 L1123.57,4 H1205.79 L1288,323 H1205.79 L1181.12,246 H1148.24 L1123.57,323 H1041.36 Z M1150.98,110 H1178.38 L1197.57,191 H1131.8 Z" fill="#F4FF15"></path>
          </svg>
        </motion.div>

        {/* Main Content */}
        <div className="hero-content">
          
          {/* Navigation Bar inside Hero */}
          <nav className="hero-nav">
            <div className="nav-left">
              <a href="#home" className="nav-link">HOME</a>
              <span className="nav-separator">|</span>
              <a href="#about" className="nav-link">ABOUT ME</a>
              <span className="nav-separator">|</span>
              <a href="#projects" className="nav-link">PROJECTS</a>
            </div>
            <div className="nav-right">
              <a href="#overview" className="nav-link">WHAT YOU GET</a>
              <span className="nav-separator">|</span>
              <a href="#services" className="nav-link">SERVICES</a>
              <span className="nav-separator">|</span>
              <a href="#clients" className="nav-link">CLIENTS</a>
              <span className="nav-separator">|</span>
              <a href="#faq" className="nav-link">FAQ</a>
            </div>
          </nav>

          {/* Center Portrait with Parallax */}
          <motion.div className="hero-portrait-container" style={{ y: portraitY }}>
            <img 
              src="https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/6926f8e053a878c5f61cc622_nenad_edit-photo_final%201.avif" 
              alt="Shiva Kumar" 
              className="hero-portrait"
            />
            
            {/* Floating Text over portrait with stagger animation */}
            <motion.div className="hero-title-overlay" style={{ y: textY }}>
              <motion.h1 
                className="hero-title"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div className="text-line-wrapper"><motion.div variants={itemVariants}>Webflow,</motion.div></motion.div>
                <motion.div className="text-line-wrapper"><motion.div variants={itemVariants}>Applied</motion.div></motion.div>
                <motion.div className="text-line-wrapper"><motion.div variants={itemVariants}>Differently.</motion.div></motion.div>
              </motion.h1>
              <motion.div 
                className="hero-cta"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <a href="#call" className="btn-yellow">Book a Call</a>
                <a href="#about" className="btn-yellow">About Me</a>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Floating Cards - Left */}
          <motion.div 
            className="floating-card stat-projects"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <div className="stat-icon webflow-yellow">
              <svg viewBox="0 0 91 57" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-icon">
                <path fillRule="evenodd" clipRule="evenodd" d="M90.0571 0L61.3209 56.1824H34.3296L46.3557 32.898H45.8162C35.8948 45.7787 21.0919 54.2582 0 56.1824V33.2204C0 33.2204 13.493 32.4233 21.4251 24.0827H0V0.00044379H24.0795V19.8078L24.62 19.8056L34.4597 0.00044379H52.6705V19.6822L53.2109 19.6813L63.4197 0H90.0571Z" fill="#F4FF15"/>
              </svg>
            </div>
            <div className="stat-text">
              <strong>80+</strong>
              <br/>Projects
            </div>
          </motion.div>

          <motion.div 
            className="floating-card stat-years"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <div className="stat-icon text-yellow" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              7+
            </div>
            <div className="stat-text">
              Years of<br/>experience
            </div>
          </motion.div>

          {/* Floating Cards - Right */}
          <motion.div 
            className="floating-card features-list"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          >
            <ul>
              <li><span className="feature-icon pie"></span> Creative</li>
              <li><span className="feature-icon flower"></span> Reliable</li>
              <li><span className="feature-icon crown"></span> Strategist</li>
              <li><span className="feature-icon diamond"></span> Builder</li>
              <li><span className="feature-icon cross"></span> Efficient</li>
            </ul>
          </motion.div>

          {/* Bottom Text */}
          <div className="hero-bottom-text left-text">
            <p>The Frontend Developer.<br/>That's Shiva.</p>
          </div>
          
          <div className="hero-bottom-text right-text">
            <p>Working closely with your team to deliver<br/>React builds that merge creativity, technical<br/>excellence, and long-term value.</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
