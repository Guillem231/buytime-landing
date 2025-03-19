import React, { useRef, useEffect, useState } from 'react';
import KinectBackground from '../KinectBackground';
import SimpleTitle from './components/SimpleTitle';
import styles from './styles/Hero.module.css';
import { useDeviceDetector } from '../MobileBlocker/hooks/useDeviceDetector';
const HeroSection = () => {
  const containerRef = useRef(null);
  const isMobile = useDeviceDetector();
  
  return (
    <section ref={containerRef} className={styles.heroSection}>
      {!isMobile && <KinectBackground showGUI={true} /> }
      <KinectBackground showGUI={false} />
      {<SimpleTitle />}
    </section>
  );
};

export default HeroSection;
