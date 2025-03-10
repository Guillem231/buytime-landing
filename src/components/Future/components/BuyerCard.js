import React from 'react';
import ServiceItem from './ServiceItem';
import useServiceRotation from '../hooks/useServiceRotation';
import styles from '../styles/Future.module.css';

const BuyerCard = ({ isVisible }) => {
  const { activeService, services } = useServiceRotation(isVisible);

  return (
    <div className={styles.timeCard}>
      <div className={styles.cardContent}>
        <h3>Time Buyer</h3>
        <div className={styles.hologramEffect}>
          <span className={styles.needText}>I need...</span>
          <div className={styles.typingContainer}>
            {services.map((service, index) => (
              <ServiceItem 
                key={index}
                text={service.request}
                isActive={index === activeService}
              />
            ))}
          </div>
        </div>
        
        <div className={styles.interactionHint}>
          <span className={styles.hintIcon}>⟳</span>
          <p>Automatically finding service matches...</p>
        </div>
      </div>
      
      <div className={styles.cardGlow}></div>
    </div>
  );
};

export default BuyerCard;
