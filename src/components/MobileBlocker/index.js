import React, { useEffect, useState } from 'react';
import { useDeviceDetector } from './hooks/useDeviceDetector';
import PortalEffect from './components/PortalEffect';
import styles from './MobileBlocker.module.css';

const MobileBlocker = () => {
  const { isMobile } = useDeviceDetector();
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (isMobile) {
      const timer = setTimeout(() => {
        setVisible(true);
        document.body.style.overflow = 'hidden';
      }, 500);
      
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    }
  }, [isMobile]);
  
  if (!isMobile || !visible) return null;
  
  return (
    <div className={styles.blocker}>
      <PortalEffect />
      
      <div className={styles.container}>
        <div className={styles.content}>
          
          <h2 className={styles.title}>Desktop Experience Only</h2>
          
          <div className={styles.message}>
            <p>BuyTime's immersive platform requires a desktop or laptop to display advanced visual effects.</p>
            
            <div className={styles.separator}></div>
            
            <p className={styles.hint}>Please visit us from a desktop device to explore the full experience.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileBlocker;
