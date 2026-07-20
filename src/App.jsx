import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import Hero from './components/Hero';
import Sidebar from './components/Sidebar';
import About from './components/About';
import Work from './components/Work';
import Overview from './components/Overview';
import Services from './components/Services';
import Clients from './components/Clients';
import Faq from './components/Faq';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import './App.css';

function App() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="app-container">
      <Cursor />
      <main>
        <Hero />
        <div className="content-layout">
          <div className="sidebar-sticky">
            <Sidebar />
          </div>
          <div className="content-scrollable">
            <About />
            <Work />
            <Overview />
            <Services />
            <Clients />
            <Faq />
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
