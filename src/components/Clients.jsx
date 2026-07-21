import React from 'react';
import { motion } from 'framer-motion';
import './Clients.css';

const Clients = () => {
  return (
    <section className="clients-section" id="clients">
      <div className="clients-container">
        <motion.div 
          className="clients-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Clients</h2>
        </motion.div>
        
        <div className="clients-grid">
          <motion.div 
            className="testimonial-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="quote-icon">"</div>
            <p className="testimonial-text">
              Shiva is an absolute powerhouse. He took our complex Figma designs and built a flawless, high-performing React site ahead of schedule. The animations are buttery smooth!
            </p>
            <div className="testimonial-author">
              <div className="author-avatar"></div>
              <div>
                <h4>Sarah Jenkins</h4>
                <p>CMO, TechStartup</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="testimonial-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="quote-icon">"</div>
            <p className="testimonial-text">
              Working with Shiva was the best decision for our agency. His deep knowledge of state management and technical SEO meant our site not only looks great, but performs exceptionally well.
            </p>
            <div className="testimonial-author">
              <div className="author-avatar"></div>
              <div>
                <h4>David Chen</h4>
                <p>Founder, Creative Agency</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Clients;
