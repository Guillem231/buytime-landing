import React, { useState, useEffect, useRef } from 'react';
import UserInterface from './components/UserInterface';
import useScrollEffect from './hooks/useScrollEffect';
import styles from './styles/BlackHole.module.css';

const AnimatedLogo = () => {
  const logoRef = useRef(null);
  
  useEffect(() => {
    if (!logoRef.current) return;
    
    let animationId;
    const logo = logoRef.current;
    
    const pulseIntensity = 0.4;
    const glowIntensity = 0.4;
    const baseScale = 0.8;
    
    let time = 0;
    
    const animate = () => {
      // MODIFICACIÓN 1: Incrementa este valor para avanzar el tiempo más rápido
      time += 0.02; // Cambiado de 0.01 a 0.02 (el doble de rápido)
      
      // MODIFICACIÓN 2: Aumenta este multiplicador para ciclos más rápidos
      const sineValue = Math.sin(time * 1.5); // Cambiado de 0.8 a 1.5 (casi el doble de frecuencia)
      
      const pulse = ((sineValue + 1) / 2 * 0.5 + 0.5) * pulseIntensity;
      
      logo.style.transform = `
        scale(${baseScale + pulse})
        rotate(${Math.sin(time * 0.3)}deg)
      `;
      
      logo.style.filter = `
        drop-shadow(0 0 ${8 + Math.sin(time) * 5}px rgba(218, 165, 32, ${0.3 + Math.sin(time * 0.5) * 0.1}))
      `;
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);
  
  return (
    <div className={styles.logoContainer}>
      <img
        ref={logoRef}
        src="/images/akron.svg"
        alt="Logo"
        className={styles.animatedLogo}
      />
    </div>
  );
};



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
        <div className={styles.visualsContainer}>
          <AnimatedLogo 
            interactionState={interactionState}
            scrollProgress={scrollProgress}
          />

        </div>
        
        {/* Interfaz de usuario */}
        <div className={styles.interfaceContainer}>
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
    </div>
  );
};

export default BlackHole;
