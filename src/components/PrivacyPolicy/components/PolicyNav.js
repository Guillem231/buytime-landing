import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/PrivacyPolicy.module.css';

const PolicyNav = ({ sections, activeSection, scrollToSection }) => {
  return (
    <nav className={styles.policyNav}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.backButton}>
          <span className={styles.backIcon}>←</span> Back to Home
        </Link>
        
        <h3>Contents</h3>
        
        <ul className={styles.navLinks}>
          {sections.map(section => (
            <li 
              key={section.id}
              className={activeSection === section.id ? styles.active : ''}
            >
              <a 
                href={`#${section.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(section.id);
                }}
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default PolicyNav;
