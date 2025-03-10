import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useScrollAnimations = (sectionRef) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.set('.section-title', { opacity: 0, y: 30 });
    gsap.set('.time-card', { opacity: 0, y: 50, rotationX: -10 });
    gsap.set('.platform-stats', { opacity: 0, y: 30 });
    gsap.set('.connection-container', { opacity: 0 });
    
    const scrollTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 95%", 
      end: "bottom top",
      onEnter: () => {
        setIsVisible(true);
        
        gsap.to('.section-title', {
          opacity: 1,
          y: 0,
          duration: 0.8, 
          ease: "power3.out"
        });
        
        gsap.to('.time-card', {
          opacity: 1,
          y: 0,
          rotationX: 0,
          stagger: 0.15, 
          duration: 0.8, 
          ease: "back.out(1.5)",
          delay: 0.1 
        });
        
        gsap.to('.connection-container', {
          opacity: 1,
          duration: 1,
          delay: 0.2 
        });
        
        gsap.to('.platform-stats', {
          opacity: 1,
          y: 0,
          stagger: 0.1, 
          duration: 0.8, 
          delay: 0.4,
          ease: "power2.out"
        });
      },
      onLeaveBack: () => {
        setIsVisible(false);
      }
    });
    
    return () => {
      scrollTrigger.kill();
    };
  }, [sectionRef]);

  return { isVisible };
};

export default useScrollAnimations;
