import React from 'react';
import styles from '../styles/Future.module.css';

const ServiceItem = ({ text, isActive }) => {
  return (
    <div 
      className={`${styles.typingText} ${isActive ? styles.active : ''}`}
    >
      {text}
    </div>
  );
};

export default ServiceItem;
