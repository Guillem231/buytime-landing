import { useState, useEffect } from 'react';

export const useDeviceDetector = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkDevice = () => {
      // Detectar por ancho de pantalla (más confiable para este caso)
      const mobileWidth = window.innerWidth < 768;
      
      // Métodos adicionales de detección
      const hasTouchScreen = (
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      );
      
      // Comprobar user agent como método secundario
      const mobileBrowser = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      
      // Combinamos los métodos para mayor precisión
      // Un dispositivo es móvil si tiene pantalla pequeña Y (tiene touch O es un navegador móvil)
      setIsMobile(mobileWidth && (hasTouchScreen || mobileBrowser));
    };
    
    // Comprobar al montar
    checkDevice();
    
    // Comprobar al redimensionar
    window.addEventListener('resize', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);
  
  return { isMobile };
};
