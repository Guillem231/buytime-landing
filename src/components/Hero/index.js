import React, { useRef, useEffect, useState } from 'react';
import KinectBackground from '../KinectBackground';
import SimpleTitle from './components/SimpleTitle';
import MobileHero from './MobileHero';
import styles from './styles/Hero.module.css';

const HeroSection = () => {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <section ref={containerRef} className={styles.heroSection}>
      <KinectBackground showGUI={false} />
      {<SimpleTitle />}
    </section>
  );
};

export default HeroSection;
