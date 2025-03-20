import React, { useEffect, useRef } from 'react';
import styles from '../styles/KinectBackground.module.css';

const MobileKinectBackground = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error("Error reproduciendo video:", err);
        // Intento adicional para iOS
        document.addEventListener('touchend', () => {
          videoRef.current.play().catch(e => console.error(e));
        }, { once: true });
      });
    }
    
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  return (
    <div 

   >

    </div>
  );
};

export default MobileKinectBackground;
