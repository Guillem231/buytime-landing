import React, { useState } from 'react';
import styles from '../styles/Contact.module.css';

const ContactOptions = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }
    
    setStatus('loading');
    setMessage('Adding to waitlist...');
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Great! We\'ll notify you when we launch.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Connection error. Please check your internet and try again.');
    }
  };

  return (
    <div className={styles.subscribeContainer}>
      <h3 className={styles.waitlistTitle}>Join our waitlist</h3>
      <p className={styles.waitlistDescription}>Be the first to know when we launch</p>
      
      <form onSubmit={handleSubmit} className={styles.waitlistForm}>
        <div className={styles.inputGroup}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            disabled={status === 'loading'}
            className={styles.emailInput}
            required
          />
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className={styles.submitButton}
          >
            {status === 'loading' ? 'Sending...' : 'Join'}
          </button>
        </div>
        
        {message && (
          <div className={`${styles.message} ${styles[status]}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactOptions;
