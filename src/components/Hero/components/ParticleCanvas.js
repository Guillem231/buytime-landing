import React, { useRef } from 'react';
import useParticleAnimation from '../hooks/useParticleAnimation';
import useWindowResize from '../hooks/useWindowResize';
import styles from '../styles/Hero.module.css';

const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  
  useParticleAnimation(canvasRef);
  useWindowResize(canvasRef);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={styles.canvas}
    />
  );
};

export default ParticleCanvas;
