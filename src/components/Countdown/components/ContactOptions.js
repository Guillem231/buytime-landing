import React from 'react';
import styles from '../styles/Countdown.module.css';

const ContactOptions = () => {
  return (
    <div className={styles.subscribeContainer}>
      <div className={styles.contactOptions}>
        <a href="mailto:pedret.guillem@gmail.com" className={styles.emailButton}>
          <i className="far fa-envelope"></i> Send us an email
        </a>
      </div>
    </div>
  );
};

export default ContactOptions;
