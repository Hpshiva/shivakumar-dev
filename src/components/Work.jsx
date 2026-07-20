import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Work.css';

const projects = [
  {
    id: 1,
    title: 'Biotech Innovation',
    category: 'Webflow Development',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'SaaS Platform',
    category: 'UI/UX Design',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Blockchain Startup',
    category: 'GSAP Animation',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f4ec651?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 4,
    title: 'Fintech App',
    category: 'Webflow CMS',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'
  }
];

const Work = () => {
  return (
    <section className="work-section" id="projects">
      <div className="work-container">
        <motion.div 
          className="work-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="h2-style-white">Selected Work</h2>
          <p className="text-muted">A curated collection of my recent projects.</p>
        </motion.div>

        <motion.div 
          className="work-swiper-container"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            breakpoints={{
              640: {
                slidesPerView: 1.5,
              },
              1024: {
                slidesPerView: 2.5,
              }
            }}
            className="work-swiper"
          >
            {projects.map((project) => (
              <SwiperSlide key={project.id}>
                <div className="work-card">
                  <div className="work-image-wrapper">
                    <img src={project.image} alt={project.title} className="work-image" />
                    <div className="work-overlay">
                      <div className="work-arrow">
                        <ArrowUpRight color="#000" size={24} />
                      </div>
                    </div>
                  </div>
                  <div className="work-info">
                    <h3>{project.title}</h3>
                    <p className="text-muted">{project.category}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};

export default Work;
