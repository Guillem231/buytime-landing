import { useEffect } from 'react';
import * as THREE from 'three';

const useMouseTracking = (mouseRef) => {
  useEffect(() => {
    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX - window.innerWidth / 2) * 8;
      mouseRef.current.y = (event.clientY - window.innerHeight / 2) * 8;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseRef]);
  
  return null;
};

export default useMouseTracking;
