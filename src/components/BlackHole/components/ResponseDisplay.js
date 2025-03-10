import React from 'react';
import styles from '../styles/BlackHole.module.css';

const ResponseDisplay = ({ responseText, resetInterface }) => {
  return (
    <div className={styles.responseContainer}>
      <div className={styles.responseHeader}>
        Response:
      </div>
      
      <p className={styles.responseText}>
        {responseText}
      </p>
      
      <button
        onClick={resetInterface}
        className={styles.actionButton}
      >
        Ask Again
      </button>
    </div>
  );
};

export default ResponseDisplay;
