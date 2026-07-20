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
        {/* Background NESH Logo with Parallax */}
        <motion.div className="hero-logo-bg" style={{ y: logoY }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 1288 338" fill="none" className="nesh-logo-svg">
            <path d="M194,4 H374 V191 H249 V268 H374 V323 H194 V136 H319 V59 H194 Z" fill="#F4FF15"></path>
            <path d="M414,4 H469 V136 H539 V4 H594 V323 H539 V191 H469 V323 H414 Z" fill="#F4FF15"></path>
            <path d="M634,4 H694 V323 H634 Z" fill="#F4FF15"></path>
            <path d="M734,4 L794,323 H854 L914,4 H854 L824,180 L794,4 Z" fill="#F4FF15"></path>
            <path d="M954,323 L1014,4 H1074 L1134,323 H1074 L1056,246 H1032 L1014,323 H954 Z M1034,110 H1054 L1068,191 H1020 Z" fill="#F4FF15"></path>
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
              alt="Nenad Popadic" 
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
            <p>The Webflow Expert.<br/>That's Nenad.</p>
          </div>
          
          <div className="hero-bottom-text right-text">
            <p>Working closely with your team to deliver<br/>Webflow builds that merge creativity, technical<br/>excellence, and long-term value.</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
