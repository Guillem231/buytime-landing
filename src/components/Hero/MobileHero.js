import React, { useRef, useEffect } from 'react';
import heroText from './constants/textConfig';
import styles from './styles/MobileHero.module.css';

const MobileHero = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.8;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Animation variables
    let animationFrame;
    let time = 0;
    let glitchTimeout;
    let isGlitching = false;
    
    // Draw the text to a temporary canvas to get pixel data
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    
    // Draw text to get pixel data
    const titleFontSize = Math.min(80, window.innerWidth / 8);
    const subtitleFontSize = Math.min(24, window.innerWidth / 20);
    
    tempCtx.font = `bold ${titleFontSize}px "Montserrat", sans-serif`;
    tempCtx.textAlign = 'center';
    tempCtx.textBaseline = 'middle';
    tempCtx.fillStyle = '#FFFFFF';
    tempCtx.fillText(heroText.title, canvas.width / 2, canvas.height * 0.4);
    
    tempCtx.font = `${subtitleFontSize}px "Montserrat", sans-serif`;
    tempCtx.fillText(heroText.subtitle, canvas.width / 2, canvas.height * 0.55);
    
    const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    // Create particles from text pixels - using much smaller spacing for more particles
    const particles = [];
    // Reduced spacing = more particles
    const titleSpacing = 1;
    const subtitleSpacing = 0.5;
    
    const titleColors = [
      '#FFD700', '#FFC107', '#F5F5F5', '#E6C200', '#FFFFF0'
    ];
    
    const subtitleColors = [
      '#F5F5F5', '#E0E0E0', '#D4AF37', '#FFFFFF', '#FFFFF0'
    ];
    
    for (let y = 0; y < canvas.height; y++) {
      const isTitle = y < canvas.height * 0.5;
      const currentSpacing = isTitle ? titleSpacing : subtitleSpacing;
      
      if (y % currentSpacing !== 0) continue;
      
      for (let x = 0; x < canvas.width; x += currentSpacing) {
        const i = (y * canvas.width + x) * 4;
        
        if (pixels[i + 3] > 20) {
          const colorPalette = isTitle ? titleColors : subtitleColors;
          const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
          
          particles.push({
            x,
            y,
            originalX: x,
            originalY: y,
            size: isTitle ? 1.0 : 0.8, // Smaller particles but more of them
            color,
            opacity: 0.7 + Math.random() * 0.3,
            phase: Math.random() * Math.PI * 2,
            isTitle
          });
        }
      }
    }
    
    // Schedule random glitch effects
    const scheduleGlitch = () => {
      const nextGlitch = 1000 + Math.random() * 4000;
      glitchTimeout = setTimeout(() => {
        isGlitching = true;
        
        setTimeout(() => {
          isGlitching = false;
          scheduleGlitch();
        }, 100 + Math.random() * 200);
      }, nextGlitch);
    };
    
    scheduleGlitch();
    
    // Main animation loop
    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw particles for title
      particles.forEach(p => {
        if (p.isTitle) {
          // Calculate wave motion
          const waveX = Math.sin(time + p.phase) * 1.5;
          const waveY = Math.cos(time * 0.8 + p.phase) * 1.5;
          
          // Apply glitch effect only to the text particles
          let offsetX = 0;
          let offsetY = 0;
          let shouldDraw = true;
          
          if (isGlitching) {
            // More aggressive glitching for title
            if (Math.random() > 0.6) {
              offsetX = (Math.random() - 0.5) * 20;
              offsetY = (Math.random() - 0.5) * 10;
            }
            
            // Randomly hide some particles during glitch (signal loss effect)
            if (Math.random() > 0.85) {
              shouldDraw = false;
            }
          }
          
          if (shouldDraw) {
            const x = p.originalX + waveX + offsetX;
            const y = p.originalY + waveY + offsetY;
            
            // Draw particle
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            
            // Change color during glitch
            if (isGlitching && Math.random() > 0.8) {
              ctx.fillStyle = Math.random() > 0.5 ? '#FF5E5E' : '#5E8AFF';
            }
            
            ctx.beginPath();
            ctx.arc(x, y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });
      
      // Draw subtitle as solid text with subtle effects
      ctx.font = `${subtitleFontSize}px "Montserrat", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Add subtle glow effect
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = isGlitching ? 8 : 4;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(heroText.subtitle, canvas.width / 2, canvas.height * 0.55);
      ctx.shadowBlur = 0;
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
      clearTimeout(glitchTimeout);
    };
  }, []);
  
  return (
    <canvas ref={canvasRef} className={styles.mobileCanvas}></canvas>
  );
};

export default MobileHero;
