import React from 'react';
import styles from '../styles/Countdown.module.css';

const CountdownUnit = ({ value, label, className }) => {
  return (
    <div className={styles.unit}>
      <div className={`${styles.value} ${className}`}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
};

export default CountdownUnit;
