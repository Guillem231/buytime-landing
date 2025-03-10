import React from 'react';
import useServiceRotation from '../hooks/useServiceRotation';
import styles from '../styles/Future.module.css';

const SellerCard = ({ isVisible }) => {
  const { activeService, services, matchActive } = useServiceRotation(isVisible);
  
  const formatRating = (rating) => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

  if (!services || services.length === 0 || activeService === undefined) {
    return (
      <div className={styles.timeCard}>
        <div className={styles.cardContent}>
          <h3>Time Seller</h3>
          <div className={styles.loadingPlaceholder}>
            <div className={styles.loadingText}>Connecting to service providers...</div>
          </div>
        </div>
        <div className={styles.cardGlow}></div>
      </div>
    );
  }

  return (
    <div className={styles.timeCard}>
      <div className={styles.cardContent}>
        <h3>Time Seller</h3>
        <div className={`${styles.serviceMatches} ${matchActive ? styles.active : ''}`}>
          {services[activeService].matches.map((match, index) => (
            <div 
              key={index} 
              className={styles.serviceMatch}
              style={{
                transitionDelay: `${index * 0.2}s`
              }}
            >
              <div className={styles.providerInfo}>
                <span className={styles.providerName}>{match.name}</span>
                <div className={styles.rating}>{formatRating(match.rating)}</div>
              </div>
              <span className={styles.service}>{match.service}</span>
              <div className={styles.availability}>
                <span className={styles.availabilityDot}></span>
                {match.availability}
              </div>
            </div>
          ))}
        </div>
        
        <div className={`${styles.matchConfirmation} ${matchActive ? styles.active : ''}`}>
          <button className={styles.confirmButton}>
            Select Provider
          </button>
        </div>
      </div>
      
      <div className={styles.cardGlow}></div>
    </div>
  );
};

export default SellerCard;
