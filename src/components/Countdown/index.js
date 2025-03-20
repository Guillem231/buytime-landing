import React from 'react';
import ParticleCanvas from './components/ParticleCanvas';
import CountdownTimer from './components/CountdownTimer';
import FooterBottom from './components/FooterBottom';
import ContactOptions from './components/ContactOptions';
import styles from './styles/Countdown.module.css';
import { useDeviceDetector } from '../MobileBlocker/hooks/useDeviceDetector';
const CountdownFooter = () => {
  const { isMobile } = useDeviceDetector();
  
  return (
    <footer className={styles.footer}>
      {!isMobile && <ParticleCanvas />}
      
      <div className={styles.footerContent}>
        <div className={styles.countdownContainer}>
          <h3 className={styles.countdownTitle}>Launching July 1st</h3>
          <CountdownTimer />
          <ContactOptions />
        </div>
        
        <FooterBottom />
      </div>
    </footer>
  );
};

export default CountdownFooter;
