import { useState, useEffect } from 'react';

const useTypewriter = (fullText, isActive) => {
  const [typewriterText, setTypewriterText] = useState("");
  
  useEffect(() => {
    if (isActive) {
      setTypewriterText("");
      
      const startDelay = setTimeout(() => {
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
          if (currentIndex < fullText.length) {
            setTypewriterText(current => fullText.substring(0, currentIndex + 1));
            currentIndex++;
          } else {
            clearInterval(typingInterval);
          }
        }, 50);
        
        return () => {
          clearInterval(typingInterval);
        };
      }, 300);
      
      return () => clearTimeout(startDelay);
    }
  }, [isActive, fullText]);
  
  return { typewriterText };
};

export default useTypewriter;
