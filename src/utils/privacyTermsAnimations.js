import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useAnimations = (textContainerRef) => {
  useEffect(() => {
    if (!textContainerRef.current) return;
    
    gsap.fromTo(
      `.${textContainerRef.current.querySelector('h1').className}`,
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
    
    gsap.fromTo(
      `.${textContainerRef.current.querySelector('p').className}`,
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: "power3.out" }
    );
    
    gsap.fromTo(
      `.${textContainerRef.current.querySelector('div[class*="titleSeparator"]').className}`,
      { scaleX: 0, opacity: 0 }, 
      { scaleX: 1, opacity: 1, duration: 0.8, delay: 0.6, ease: "power3.inOut" }
    );
    
    gsap.fromTo(
      textContainerRef.current.querySelector('div[class*="termsLayout"]'),
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, delay: 0.9, ease: "power3.out" }
    );
    
    const sections = textContainerRef.current.querySelectorAll('section');
    
    sections.forEach(section => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(
            section,
            { y: 30, opacity: 0.6 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
          );
        },
        once: true
      });
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [textContainerRef]);
  
  return null;
};

export default useAnimations;
