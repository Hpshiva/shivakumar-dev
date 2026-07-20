import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Services.css';

const Services = () => {
  const [openIndex, setOpenIndex] = useState(0); // First one open by default

  const services = [
    { title: 'Webflow Development', desc: 'Custom CMS architecture, precise layouts, and lightning-fast load times. We ensure your site scales effortlessly with your business.' },
    { title: 'Interactive Animations', desc: 'Engaging user experiences powered by GSAP, Framer Motion, and Webflow interactions to make your brand memorable.' },
    { title: 'Figma to Webflow', desc: 'Pixel-perfect translation of your designs into a fully functional, responsive website without losing any creative integrity.' },
    { title: 'Site Migration', desc: 'Seamlessly moving your existing WordPress or custom site over to Webflow while preserving and improving SEO.' }
  ];

  return (
    <section className="services-section" id="services">
      <div className="services-container">
        <div className="services-left">
          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="services-subtitle"
          >
            Everything you need to build, launch, and scale your digital presence.
          </motion.p>
        </div>
        
        <div className="services-right">
          {services.map((service, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div 
                className={`service-item ${isOpen ? 'active' : ''}`}
                key={idx}
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                layout
              >
                <motion.div className="service-header" layout>
                  <h3>{service.title}</h3>
                  <motion.span 
                    className="service-plus"
                    animate={{ rotate: isOpen ? 45 : 0, color: isOpen ? '#F4FF15' : '#999' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    +
                  </motion.span>
                </motion.div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div 
                      className="service-desc-wrapper"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      <p className="service-desc-text">{service.desc}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
