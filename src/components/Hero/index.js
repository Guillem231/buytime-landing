import React, { useRef } from 'react';
import KinectBackground from '../KinectBackground';
import ParticleCanvas from './components/ParticleCanvas';
import styles from './styles/Hero.module.css';

const HeroSection = () => {
  const containerRef = useRef(null);
  
  return (
    <section ref={containerRef} className={styles.heroSection}>
      <KinectBackground showGUI={false} />
      <ParticleCanvas />
    </section>
  );
};

export default HeroSection;
