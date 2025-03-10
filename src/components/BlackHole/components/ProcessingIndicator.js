import React from 'react';
import styles from '../styles/BlackHole.module.css';

const ProcessingIndicator = () => {
  return (
    <div className={styles.processingContainer}>
      <div className={styles.processingText}>
        PROCESSING RESPONSE...
      </div>
      
      <div className={styles.dotsContainer}>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={styles.dot}
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProcessingIndicator;
