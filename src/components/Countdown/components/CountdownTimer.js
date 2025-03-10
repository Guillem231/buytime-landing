import React, { useRef } from 'react';
import CountdownUnit from './CountdownUnit';
import useCountdown from '../hooks/useCountdown';
import styles from '../styles/Countdown.module.css';

const CountdownTimer = () => {
  const countdownRef = useRef(null);
  const { timeLeft, formatTimeUnit } = useCountdown();

  return (
    <div ref={countdownRef} className={styles.timer}>
      <CountdownUnit value={formatTimeUnit(timeLeft.days)} label="Days" className="days-value" />
      
      <div className={styles.separator}>:</div>
      
      <CountdownUnit value={formatTimeUnit(timeLeft.hours)} label="Hours" className="hours-value" />
      
      <div className={styles.separator}>:</div>
      
      <CountdownUnit value={formatTimeUnit(timeLeft.minutes)} label="Minutes" className="minutes-value" />
      
      <div className={styles.separator}>:</div>
      
      <CountdownUnit value={formatTimeUnit(timeLeft.seconds)} label="Seconds" className="seconds-value" />
    </div>
  );
};

export default CountdownTimer;
