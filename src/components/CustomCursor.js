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
        gsap.set(cursor, {
          left: mouseX,
          top: mouseY
        });
        gsap.set(follower, {
          left: posX - 6,
          top: posY - 6
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