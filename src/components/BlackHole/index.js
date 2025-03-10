import React, { useState } from 'react';
import BlackHoleCanvas from './components/BlackHoleCanvas';
import UserInterface from './components/UserInterface';
import useScrollEffect from './hooks/useScrollEffect';
import styles from './styles/BlackHole.module.css';

const BlackHole = () => {
  const [interactionState, setInteractionState] = useState('prompt');
  const [inputText, setInputText] = useState('');
  const [responseText, setResponseText] = useState('');
  const [inputMethod, setInputMethod] = useState(null);
  
  const { 
    containerRef, 
    isVisible, 
    scrollProgress, 
    backgroundOpacity 
  } = useScrollEffect();

  return (
    <div className={styles.blackHoleWrapper}>
      <div ref={containerRef} className={styles.blackHoleInterface}>
        <BlackHoleCanvas 
          interactionState={interactionState}
          scrollProgress={scrollProgress}
        />
        
        <UserInterface 
          interactionState={interactionState}
          setInteractionState={setInteractionState}
          inputText={inputText}
          setInputText={setInputText}
          responseText={responseText}
          setResponseText={setResponseText}
          inputMethod={inputMethod}
          setInputMethod={setInputMethod}
          scrollProgress={scrollProgress}
        />
      </div>
    </div>
  );
};

export default BlackHole;
