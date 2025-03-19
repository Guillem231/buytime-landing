import { useState, useEffect, useRef } from 'react';
import services from '../data/servicesData';

const useServiceRotation = (isVisible) => {
  const [activeService, setActiveService] = useState(0);
  const [matchActive, setMatchActive] = useState(false);
  // Usando refs para tener control sobre los timers
  const timersRef = useRef([]);
  
  // Función para limpiar todos los timers
  const clearAllTimers = () => {
    timersRef.current.forEach(timer => {
      if (timer.type === 'timeout') {
        clearTimeout(timer.id);
      } else if (timer.type === 'interval') {
        clearInterval(timer.id);
      }
    });
    timersRef.current = [];
  };
  
  // Función segura para añadir timers
  const addTimer = (id, type) => {
    timersRef.current.push({ id, type });
    return id;
  };

  useEffect(() => {
    if (!isVisible) {
      clearAllTimers();
      return;
    }
    
    // Reset state when component becomes visible
    setActiveService(0);
    setMatchActive(false);
    
    // Fixed timing constants
    const initialDisplayTime = 5000; // 5 seconds to show initial content
    const transitionTime = 1500; // Time for transitions
    const cycleTime = 5000; // 5 seconds per service
    
    // Show matches after initial transition
    const matchTimer = setTimeout(() => {
      setMatchActive(true);
    }, transitionTime);
    addTimer(matchTimer, 'timeout');
    
    // Start cycling after initial display period
    const cycleTimer = setTimeout(() => {
      // Function to handle the service change cycle
      const handleServiceCycle = () => {
        // Hide matches before changing service
        setMatchActive(false);
        
        // Change service after transition out
        const changeServiceTimer = setTimeout(() => {
          setActiveService(prev => (prev + 1) % services.length);
          
          // Show matches for new service after transition
          const showMatchesTimer = setTimeout(() => {
            setMatchActive(true);
          }, transitionTime / 2);
          addTimer(showMatchesTimer, 'timeout');
        }, transitionTime / 2);
        addTimer(changeServiceTimer, 'timeout');
      };
      
      // Set the initial cycle
      handleServiceCycle();
      
      // Create an interval for cycling through services
      const intervalId = setInterval(handleServiceCycle, cycleTime + transitionTime);
      addTimer(intervalId, 'interval');
      
    }, initialDisplayTime);
    addTimer(cycleTimer, 'timeout');
    
    // Cleanup all timers when component unmounts or isVisible changes
    return clearAllTimers;
  }, [isVisible]);
  
  return { activeService, matchActive, services };
};

export default useServiceRotation;
