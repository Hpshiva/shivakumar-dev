import React from 'react';
import { motion } from 'framer-motion';
import './Overview.css';

const Overview = () => {
  const cards = [
    { id: 1, title: 'Speed & Performance', desc: 'Optimized assets and clean structure ensuring sub-second load times.' },
    { id: 2, title: 'SEO Optimized', desc: 'Built-in best practices for technical SEO, metadata, and schema.' },
    { id: 3, title: 'Scalable Systems', desc: 'CMS architecture designed for easy updates and future growth.' },
    { id: 4, title: 'Pixel-Perfect', desc: 'Exact replication of Figma designs into fully responsive Webflow builds.' },
  ];

  return (
    <section className="overview-section" id="overview">
      <div className="overview-container">
        <motion.div 
          className="overview-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>What you get</h2>
        </motion.div>
        
        <div className="overview-grid">
          {cards.map((card, i) => (
            <motion.div 
              className="overview-card"
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="overview-icon-placeholder">
                <span className="overview-icon-inner"></span>
              </div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Overview;
