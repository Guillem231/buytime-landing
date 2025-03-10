import React, { useRef } from 'react';
import useParticleEffect from '../hooks/useParticleEffect';
import styles from '../styles/Countdown.module.css';

const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  useParticleEffect(canvasRef);
  
  return <canvas ref={canvasRef} className={styles.canvas} />;
};

export default ParticleCanvas;
