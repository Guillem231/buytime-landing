import { useRef, useState, useEffect } from 'react';

const useScrollEffect = () => {
  const containerRef = useRef(null);
  const observerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0);
  
  useEffect(() => {
    const originalBackground = window.getComputedStyle(document.body).backgroundColor;
    
    const handleIntersection = (entries) => {
      const entry = entries[0];
      setIsVisible(entry.isIntersecting);
      
      if (entry.isIntersecting) {
        const viewportHeight = window.innerHeight;
        const boundingRect = entry.boundingClientRect;
        
        let visiblePortion = 0;
        
        if (boundingRect.top < 0) {
          const visibleHeight = Math.min(boundingRect.bottom, viewportHeight);
          visiblePortion = visibleHeight / boundingRect.height;
        } else if (boundingRect.bottom > viewportHeight) {
          const visibleHeight = viewportHeight - boundingRect.top;
          visiblePortion = visibleHeight / boundingRect.height;
        } else {
          visiblePortion = 1;
        }
        
        visiblePortion = Math.max(0, Math.min(1, visiblePortion));
        setScrollProgress(visiblePortion);
        
        const opacity = visiblePortion * 0.3;
        document.body.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
        document.body.style.transition = 'background-color 0.3s ease';
        setBackgroundOpacity(opacity);
      } else {
        document.body.style.backgroundColor = originalBackground;
      }
    };
    
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
      observerRef.current = observer;
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      document.body.style.backgroundColor = originalBackground;
    };
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !isVisible) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      let progress = 0;
      
      if (rect.top <= 0 && rect.bottom >= viewportHeight) {
        progress = 1;
      } else if (rect.top < viewportHeight && rect.bottom > 0) {
        const totalHeight = rect.height + viewportHeight;
        const visibleHeight = viewportHeight - Math.max(0, rect.top) - Math.max(0, viewportHeight - rect.bottom);
        progress = visibleHeight / Math.min(rect.height, viewportHeight);
      }
      
      progress = Math.max(0, Math.min(1, progress));
      setScrollProgress(progress);
      
      const opacity = progress * 0.95;
      setBackgroundOpacity(opacity);
      document.body.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible]);
  
  return { containerRef, isVisible, scrollProgress, backgroundOpacity };
};

export default useScrollEffect;
