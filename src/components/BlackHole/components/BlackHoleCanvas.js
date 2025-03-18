import React, { useRef, useEffect } from 'react';
import useBlackHoleAnimation from '../hooks/useBlackHoleAnimation';
import styles from '../styles/BlackHole.module.css';

const BlackHoleCanvas = ({ interactionState, scrollProgress }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  const { handleBlackHoleClick } = useBlackHoleAnimation(
    canvasRef, 
    interactionState,
    scrollProgress
  );

  return (
    <div 
      ref={containerRef}
      className={styles.blackHoleContainer}
      onClick={interactionState === 'idle' ? handleBlackHoleClick : undefined}
    >
      
      <canvas 
        ref={canvasRef} 
        className={styles.blackHoleCanvas}
      />
      
      {interactionState === 'idle' && (
        <div className={styles.interactPrompt}>
          <div className={styles.interactText}>CLICK TO INTERACT</div>
        </div>
      )}
    </div>
  );
};

export default BlackHoleCanvas;
