import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Countdown.module.css';

const FooterBottom = () => {
  return (
    <div className={styles.footerBottom}>
      <div className={styles.copyright}>
        © {new Date().getFullYear()} BuyTime. All rights reserved.
      </div>
      
      <div className={styles.socialLinks}>
        <a href="#" className={styles.socialLink}>
          <i className="fab fa-twitter"></i>
        </a>
        <a href="#" className={styles.socialLink}>
          <i className="fab fa-instagram"></i>
        </a>
        <a href="#" className={styles.socialLink}>
          <i className="fab fa-facebook"></i>
        </a>
        <a href="#" className={styles.socialLink}>
          <i className="fab fa-linkedin"></i>
        </a>
      </div>
      
      <div className={styles.legalLinks}>
        <Link to="/privacy-policy" className={styles.legalLink}>Privacy Policy</Link>
        <Link to="/terms-of-service" className={styles.legalLink}>Terms of Service</Link>
      </div>
    </div>
  );
};

export default FooterBottom;
