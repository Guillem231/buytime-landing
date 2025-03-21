import React, { useState, useEffect } from 'react';
import styles from './Loader.module.css';

const PageLoader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle complete page load
    const handleLoad = () => {
      // Small delay to ensure smooth transition
      setTimeout(() => setLoading(false), 800);
    };

    // Check if document is already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Safety timeout to ensure loader doesn't stay indefinitely
    const safetyTimeout = setTimeout(() => setLoading(false), 5000);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(safetyTimeout);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className={styles.pageLoaderOverlay}>
      <div className={styles.pageLoaderContainer}>
        <div className={styles.loaderAnimation}>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
        </div>
        <div className={styles.loadingText}>
          <span>L</span>
          <span>O</span>
          <span>A</span>
          <span>D</span>
          <span>I</span>
          <span>N</span>
          <span>G</span>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
