import React, { useRef, useEffect, useState } from 'react';
import styles from '../styles/Hero.module.css';

const SimpleTitle = () => {
  const containerRef = useRef(null);
  const [svgLoaded, setSvgLoaded] = useState(false);
  
  // Precargar la imagen SVG antes de renderizar
  useEffect(() => {
    const preloadSVG = new Image();
    preloadSVG.src = '/images/akron.svg';
    preloadSVG.onload = () => {
      setSvgLoaded(true);
    };
    preloadSVG.onerror = () => {
      console.error('Error cargando SVG');
      // Incluso con error, marcar como cargado para no dejar la UI bloqueada
      setSvgLoaded(true);
    };
  }, []);
  
  // Efecto para animar solo cuando el SVG está cargado
  useEffect(() => {
    if (!svgLoaded) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const title = container.querySelector(`.${styles.simpleTitle}`);
    const subtitle = container.querySelector(`.${styles.simpleSubtitle}`);
    
    if (title) {
      title.style.opacity = '1';
      title.style.transform = 'translateY(0)';
    }
    
    if (subtitle) {
      setTimeout(() => {
        subtitle.style.opacity = '1';
        subtitle.style.transform = 'translateY(0)';
      }, 400);
    }
  }, [svgLoaded]);
  
  // Añade una clase de ocultamiento si el SVG no está cargado
  const hiddenClass = !svgLoaded ? styles.hidden : '';
  
  return (
    <div ref={containerRef} className={styles.simpleTitleContainer}>
      
      <h1 className={`${styles.simpleTitle} ${hiddenClass}`}>
        <span className={styles.buyText}>
          A I K R
          <span className={styles.logoContainer}>
            <img 
              src="/images/akron.svg" 
              alt="O"
              className={styles.logoImage}
              onLoad={() => setSvgLoaded(true)}
            />
          </span>
          N
        </span>
      </h1>
      <p className={`${styles.simpleSubtitle} ${hiddenClass}`}>
        join the time revolution
      </p>
    </div>
  );
};

export default SimpleTitle;
