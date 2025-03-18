import { useState, useEffect } from 'react';
import services from '../data/servicesData';

const useServiceRotation = (isVisible) => {
  const [activeService, setActiveService] = useState(0);
  const [matchActive, setMatchActive] = useState(false);
  
  useEffect(() => {
    if (!isVisible) return;
    
    // Reset state when component becomes visible
    setActiveService(0);
    
    // Fixed timing constants
    const initialDisplayTime = 5000; // 5 seconds to show initial content
    const transitionTime = 1500; // Time for transitions
    const cycleTime = 5000; // 5 seconds per service
    
    // Show matches after initial transition
    const matchTimer = setTimeout(() => {
      setMatchActive(true);
    }, transitionTime);
    
    // Start cycling after initial display period
    const cycleTimer = setTimeout(() => {
      // Create a predictable interval for cycling through services
      const serviceCycleInterval = setInterval(() => {
        // Hide matches before changing service
        setMatchActive(false);
        
        // Wait for transition out, then change service
        setTimeout(() => {
          setActiveService(prev => (prev + 1) % services.length);
          
          // Show matches for new service after transition
          setTimeout(() => {
            setMatchActive(true);
          }, transitionTime / 2);
        }, transitionTime / 2);
      }, cycleTime + transitionTime);
      
      return () => clearInterval(serviceCycleInterval);
    }, initialDisplayTime);
    
    return () => {
      clearTimeout(matchTimer);
      clearTimeout(cycleTimer);
    };
  }, [isVisible, services.length]);
  
  return { activeService, matchActive, services };
};

export default useServiceRotation;