import { useEffect } from 'react';

const useAnimation = (animationFrameRef, cameraRef, mouseRef, centerRef) => {
  useEffect(() => {
    // Check if mobile device
    const isMobile = window.innerWidth < 768;
    
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      if (cameraRef.current) {
        // Only use mouse tracking on desktop, not on mobile
        // (mobile will use touch controls instead)
        if (!isMobile) {
          cameraRef.current.position.x += (mouseRef.current.x - cameraRef.current.position.x) * 0.05;
          cameraRef.current.position.y += (-mouseRef.current.y - cameraRef.current.position.y) * 0.05;
        }
        cameraRef.current.lookAt(centerRef.current);
      }
      
      if (window.renderer && window.scene && cameraRef.current) {
        window.renderer.render(window.scene, cameraRef.current);
      }
    };
    
    animate();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animationFrameRef, cameraRef, mouseRef, centerRef]);
  
  return null;
};

export default useAnimation;
