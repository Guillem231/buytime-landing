import { useEffect } from 'react';

const useWindowResize = (canvasRef) => {
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      window.location.reload();
    };
    
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 250);
    });
    
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasRef]);
  
  return null;
};

export default useWindowResize;
