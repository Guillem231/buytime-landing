import React, { useRef } from 'react';
import styles from '../styles/PrivacyPolicy.module.css';

const PolicySection = ({ id, title, content }) => {
  const sectionRef = useRef(null);
  
  return (
    <section id={id} className={styles.policySection} ref={sectionRef}>
      <h2>{title}</h2>
      <div className={styles.sectionContent}>
        {content}
      </div>
    </section>
  );
};

export default PolicySection;
