import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Faq.css';

const faqs = [
  { question: "What is your typical project timeline?", answer: "A typical Webflow build takes between 3 to 6 weeks, depending on the complexity of the design, CMS requirements, and custom animations." },
  { question: "Do you design the websites as well?", answer: "My core expertise is development. I usually partner with designers or take your existing Figma files and turn them into functional Webflow sites. However, I can provide UX/UI improvements during the build process." },
  { question: "Will I be able to update the site myself?", answer: "Absolutely! I build sites using Webflow's powerful CMS (Content Management System) and Client Editor, making it incredibly easy for you or your team to edit text, add blog posts, and update images without touching any code." },
  { question: "How much does a custom Webflow site cost?", answer: "Every project is unique. Pricing depends on the scope, number of pages, CMS collections, and complexity of animations. Let's hop on a call to discuss your specific needs and I'll provide a custom quote." }
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="faq-container">
        <motion.div 
          className="faq-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Frequently Asked Questions</h2>
        </motion.div>
        
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <motion.div 
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
              key={index}
              onClick={() => toggleFaq(index)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="faq-question">
                <h3>{faq.question}</h3>
                <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
              </div>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div 
                    className="faq-answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
