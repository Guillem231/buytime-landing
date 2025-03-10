import React, { useRef, useEffect } from 'react';
import styles from '../styles/BlackHole.module.css';

const TextInput = ({ inputText, setInputText, handleSubmit, resetInterface }) => {
  const textInputRef = useRef(null);
  
  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  }, []);
  
  return (
    <form 
      onSubmit={handleSubmit}
      className={styles.inputForm}
    >
      <textarea
        ref={textInputRef}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Ask anything..."
        className={styles.textArea}
      />
      
      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={resetInterface}
          className={styles.cancelButton}
        >
          Cancel
        </button>
        
        <button
          type="submit"
          disabled={!inputText.trim()}
          className={`${styles.submitButton} ${!inputText.trim() ? styles.disabled : ''}`}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default TextInput;
