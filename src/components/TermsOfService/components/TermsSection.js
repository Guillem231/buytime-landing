import React, { useRef } from 'react';
import styles from '../styles/TermsOfService.module.css';

const TermsSection = ({ id, title, content }) => {
  const sectionRef = useRef(null);
  
  return (
    <section id={id} className={styles.termsSection} ref={sectionRef}>
      <h2>{title}</h2>
      <div className={styles.sectionContent}>
        {content}
      </div>
    </section>
  );
};

export default TermsSection;
