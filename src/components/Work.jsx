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
    title: 'Agan Health',
    category: 'Healthcare Platform',
    image: './images/agan_health.png'
  },
  {
    id: 2,
    title: 'Trident Hyundai',
    category: 'Automotive Platform',
    image: './images/trident_hyundai.png'
  },
  {
    id: 3,
    title: 'Pristine Renault',
    category: 'Automotive Platform',
    image: './images/pristine_renault.png'
  },
  {
    id: 4,
    title: 'Kinara Capital',
    category: 'Fintech Platform',
    image: './images/kinara_capital.png'
  },
  {
    id: 5,
    title: 'Design Esthetics',
    category: 'Creative Agency Portal',
    image: './images/design_esthetics.png'
  },
  {
    id: 6,
    title: 'Pristine Isuzu',
    category: 'Automotive Commerce',
    image: './images/pristine_isuzu.png'
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
