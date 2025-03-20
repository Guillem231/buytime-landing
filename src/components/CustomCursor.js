import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    let mouseX = 0;
    let mouseY = 0;
    let posX = 0;
    let posY = 0;

    const mouseMoveHandler = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    gsap.to({}, {
      duration: 0.016,
      repeat: -1,
      onRepeat: () => {
        posX += (mouseX - posX) / 10;
        posY += (mouseY - posY) / 10;
        
        // Usar transform para centrar exactamente el cursor
        gsap.set(cursor, {
          left: mouseX,
          top: mouseY,
          xPercent: -50,
          yPercent: -50
        });
        
        // Hacer lo mismo con el follower
        gsap.set(follower, {
          left: posX,
          top: posY,
          xPercent: -50,
          yPercent: -50
        });
      }
    });

    window.addEventListener('mousemove', mouseMoveHandler);
    return () => window.removeEventListener('mousemove', mouseMoveHandler);
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor"></div>
      <div ref={followerRef} className="cursor-follower"></div>
    </>
  );
};

export default CustomCursor;
