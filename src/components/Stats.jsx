import React, { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import './Stats.css';

const AnimatedNumber = ({ value }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return springValue.onChange((latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat('en-US').format(Math.floor(latest));
      }
    });
  }, [springValue]);

  return <span ref={ref} />;
};

const Stats = () => {
  return (
    <section className="stats-section" id="about">
      <div className="stats-container">
        <div className="stats-grid">
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="stat-value text-gradient">
              <AnimatedNumber value={80} />+
            </h3>
            <p className="stat-desc">Successfully completed projects</p>
          </motion.div>
          
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="stat-value text-gradient">
              <AnimatedNumber value={7} />+
            </h3>
            <p className="stat-desc">Years of Webflow experience</p>
          </motion.div>
          
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="stat-value text-gradient">
              <AnimatedNumber value={100} />%
            </h3>
            <p className="stat-desc">Client satisfaction rate</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
