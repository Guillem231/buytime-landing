import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const useCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const prevTimeRef = useRef({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date(new Date().getFullYear(), 6, 1);
      const now = new Date();
      
      if (now > targetDate) {
        targetDate.setFullYear(targetDate.getFullYear() + 1);
      }
      
      const difference = targetDate - now;
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        return { days, hours, minutes, seconds };
      }
      
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    setTimeLeft(calculateTimeLeft());
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    const daysEl = document.querySelector('.days-value');
    const hoursEl = document.querySelector('.hours-value');
    
    if (timeLeft.days !== prevTimeRef.current.days && daysEl) {
      gsap.fromTo(daysEl, 
        { y: -10, opacity: 0.3 }, 
        { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    }

    prevTimeRef.current = { ...timeLeft };
  }, [timeLeft]);
  
  const formatTimeUnit = (unit) => {
    return unit < 10 ? `0${unit}` : unit;
  };

  return { timeLeft, formatTimeUnit };
};

export default useCountdown;
