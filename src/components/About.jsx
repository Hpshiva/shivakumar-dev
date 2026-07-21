import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-header">
        <div className="badge-pill">START SMALL GROW BIG</div>
        <h2 className="about-title">
          About Me (&)<br />My Journey
        </h2>
        <p className="about-description">
          Highly focused on frontend engineering, converting design visions into performant, accessible React applications with solid SEO foundation.
        </p>
      </div>

      <div className="timeline-container">
        {/* Simplified Timeline SVG line */}
        <svg className="timeline-svg" viewBox="0 0 500 1500" preserveAspectRatio="none">
          <path 
            d="M 50 0 C 50 200, 450 300, 450 500 C 450 700, 50 800, 50 1000 C 50 1200, 450 1300, 450 1500" 
            fill="none" 
            stroke="#111" 
            strokeWidth="2" 
          />
          {/* Yellow dots on timeline */}
          <circle cx="250" cy="250" r="6" fill="#F4FF15" stroke="#111" strokeWidth="2" />
          <circle cx="250" cy="750" r="6" fill="#F4FF15" stroke="#111" strokeWidth="2" />
          <circle cx="250" cy="1250" r="6" fill="#F4FF15" stroke="#111" strokeWidth="2" />
        </svg>

        {/* Milestone 2023 */}
        <motion.div 
          className="timeline-card right-aligned"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h3 className="timeline-year">'23</h3>
          <h4 className="timeline-card-title">Utilinet Internship</h4>
          <p className="timeline-card-text">
            Completed my Master's degree and secured a software developer internship at Utilinet. Gained a solid end-to-end understanding of database schema design and RESTful API structures.
          </p>
          <div className="timeline-footer">
            <div className="timeline-meta">
              <div className="meta-avatars">
                <div className="meta-avatar"><span style={{color: '#F4FF15', fontSize: '12px'}}>🗄️</span></div>
                <div className="meta-avatar" style={{marginLeft: '-10px'}}><span style={{color: '#F4FF15', fontSize: '10px', fontWeight: 'bold'}}>JAVA</span></div>
              </div>
              <div className="meta-info">
                <span className="meta-handle">@utilinet</span>
                <span className="meta-time">3years ago</span>
              </div>
            </div>
            <button className="read-more-btn">Read more</button>
          </div>
        </motion.div>

        {/* Milestone 2024 */}
        <motion.div 
          className="timeline-card left-aligned"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h3 className="timeline-year">'24</h3>
          <h4 className="timeline-card-title">Design Esthetics</h4>
          <p className="timeline-card-text">
            Joined Design Esthetics in Bengaluru as a Frontend Developer, shifting focus entirely to client-facing web applications.
          </p>
          <div className="timeline-footer">
            <div className="timeline-meta">
              <div className="meta-avatars">
                <div className="meta-avatar"><span style={{color: '#F4FF15', fontSize: '12px'}}>✓</span></div>
                <div className="meta-avatar" style={{marginLeft: '-10px'}}><span style={{color: '#F4FF15', fontSize: '12px'}}>React</span></div>
              </div>
              <div className="meta-info">
                <span className="meta-handle">@designesthetics</span>
                <span className="meta-time">2years ago</span>
              </div>
            </div>
            <button className="read-more-btn">Read more</button>
          </div>
        </motion.div>

        {/* Milestone 2025 */}
        <motion.div 
          className="timeline-card right-aligned"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h3 className="timeline-year">'25</h3>
          <h4 className="timeline-card-title">Scaling Healthcare & E-Com</h4>
          <p className="timeline-card-text">
            Delivered key platforms like Agan Health and Kandalaa E-Commerce, boosting performance and Lighthouse scores by up to 65%.
          </p>
          <div className="timeline-footer">
            <div className="timeline-meta">
              <div className="meta-avatars">
                <div className="meta-avatar"><span style={{color: '#F4FF15', fontSize: '12px'}}>🏥</span></div>
              </div>
              <div className="meta-info">
                <span className="meta-handle">@aganhealth</span>
                <span className="meta-time">1year ago</span>
              </div>
            </div>
            <button className="read-more-btn">Read more</button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default About;
