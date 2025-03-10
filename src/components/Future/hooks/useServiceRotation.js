import { useState, useEffect } from 'react';
import services from '../data/servicesData';

const useServiceRotation = (isVisible) => {
  const [activeService, setActiveService] = useState(0);
  const [matchActive, setMatchActive] = useState(false);
  
useEffect(() => {
  if (!isVisible) return;
  
  setActiveService(0);
  setTimeout(() => {
    setMatchActive(true);
  }, 1500);
  
  const initialDelay = setTimeout(() => {
    const serviceCycleInterval = setInterval(() => {
      setActiveService(prev => (prev + 1) % services.length);
      
      setMatchActive(false);
      
      setTimeout(() => {
        setMatchActive(true);
      }, 1800);
    }, 6000);
    
    return () => {
      clearInterval(serviceCycleInterval);
    };
  }, 7500); 
  
  return () => {
    clearTimeout(initialDelay);
  };
}, [isVisible, services.length]);

  
  return { activeService, matchActive, services };
};

export default useServiceRotation;
