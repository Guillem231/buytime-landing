import React, { useState } from 'react';
import useVoiceRecognition from '../hooks/useVoiceRecognition';
import styles from '../styles/BlackHole.module.css';

const VoiceInput = ({ inputText, setInputText, processInput, resetInterface }) => {
  const [recording, setRecording] = useState(false);
  
  const { startVoiceRecording } = useVoiceRecognition({
    setInputText,
    setRecording,
    onTranscriptReceived: (transcript) => {
      setTimeout(() => processInput(transcript), 500);
    }
  });
  
  return (
    <div className={`${styles.voiceContainer} ${recording ? styles.recording : ''}`}>
      <div className={styles.voicePrompt}>
        {recording 
          ? "Listening to your voice..." 
          : inputText 
            ? "I heard you say:" 
            : "Click the microphone to begin speaking"}
      </div>
      
      {inputText && !recording && (
        <div className={styles.transcriptBox}>
          "{inputText}"
        </div>
      )}
      
      <div className={styles.buttonGroup}>
        {!recording && (
          <button
            onClick={resetInterface}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        )}
        
        {!recording && inputText && (
          <button
            onClick={() => processInput()}
            className={styles.submitButton}
          >
            Submit
          </button>
        )}
        
        {!recording && !inputText && (
          <button
            onClick={startVoiceRecording}
            className={styles.micButton}
          >
            🎤
          </button>
        )}
        
        {recording && (
          <div className={styles.recordingIndicator}>
            🎤
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceInput;
