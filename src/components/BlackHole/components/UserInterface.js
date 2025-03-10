import React from 'react';
import TextInput from './TextInput';
import VoiceInput from './VoiceInput';
import ResponseDisplay from './ResponseDisplay';
import ProcessingIndicator from './ProcessingIndicator';
import useTypewriter from '../hooks/useTypewriter';
import { getRandomResponse } from '../constants/responses';
import styles from '../styles/BlackHole.module.css';

const UserInterface = ({
  interactionState,
  setInteractionState,
  inputText,
  setInputText,
  responseText,
  setResponseText,
  inputMethod,
  setInputMethod,
  scrollProgress
}) => {
  const { typewriterText } = useTypewriter(
    "What service would you like to hire?",
    interactionState === 'prompt'
  );

  const selectInputMethod = (method) => {
    setInputMethod(method);
    setInteractionState('inputting');
  };

  const processInput = (text = inputText) => {
    if (!text.trim()) return;
    
    setInteractionState('processing');
    
    setTimeout(() => {
      const randomResponse = getRandomResponse();
      setResponseText(randomResponse);
      setInteractionState('response');
    }, 2000);
  };

  const resetInterface = () => {
    const opacity = scrollProgress * 0.95;
    document.body.style.transition = 'background-color 1s ease';
    document.body.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
    
    setInteractionState('prompt');
    setInputText('');
    setResponseText('');
    setInputMethod(null);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    processInput();
  };

  return (
    <div className={styles.interfaceContainer}>
      {interactionState === 'prompt' && (
        <div className={styles.promptContainer}>
          <div className={styles.promptBox}>
            <p className={styles.promptText}>
              {typewriterText}
              <span className={styles.cursorBlink}>|</span>
            </p>
          </div>
          
          <div className={styles.buttonContainer}>
            <button 
              onClick={() => selectInputMethod('text')}
              className={styles.actionButton}
            >
              Type Message
            </button>
            
            <button 
              onClick={() => selectInputMethod('voice')}
              className={styles.actionButton}
            >
              Speak to Us
            </button>
          </div>
        </div>
      )}
      
      {interactionState === 'inputting' && inputMethod === 'text' && (
        <TextInput
          inputText={inputText}
          setInputText={setInputText}
          handleSubmit={handleSubmit}
          resetInterface={resetInterface}
        />
      )}
      
      {interactionState === 'inputting' && inputMethod === 'voice' && (
        <VoiceInput
          inputText={inputText}
          setInputText={setInputText}
          processInput={processInput}
          resetInterface={resetInterface}
        />
      )}
      
      {interactionState === 'processing' && (
        <ProcessingIndicator />
      )}
      
      {interactionState === 'response' && (
        <ResponseDisplay
          responseText={responseText}
          resetInterface={resetInterface}
        />
      )}
    </div>
  );
};

export default UserInterface;
