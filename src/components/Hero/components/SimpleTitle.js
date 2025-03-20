import React, { useRef, useEffect } from 'react';
import styles from '../styles/Hero.module.css';

const SimpleTitle = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    // Animación de entrada simple
    const container = containerRef.current;
    if (!container) return;
    
    const title = container.querySelector(`.${styles.simpleTitle}`);
    const subtitle = container.querySelector(`.${styles.simpleSubtitle}`);
    
    if (title) {
      title.style.opacity = '1';
      title.style.transform = 'translateY(0)';
    }
    
    if (subtitle) {
      setTimeout(() => {
        subtitle.style.opacity = '1';
        subtitle.style.transform = 'translateY(0)';
      }, 400);
    }
  }, []);
  
  return (
    <div ref={containerRef} className={styles.simpleTitleContainer}>
      <h1 className={styles.simpleTitle}>
        <span className={styles.buyText}>
          A K R
          <span className={styles.logoContainer}>
            <img 
              src="/images/akron.png" 
              alt="O"
              className={styles.logoImage}
            />
          </span>
          N
        </span>
      </h1>
      <p className={styles.simpleSubtitle}>
        join the time revolution
      </p>
    </div>
  );
};

export default SimpleTitle;
