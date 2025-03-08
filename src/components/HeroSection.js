import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import KinectBackground from './KinectBackground';

const HeroSection = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const textRef = useRef({
    title: "BUYTIME",
    subtitle: "Transform Your Time into Infinite Possibilities"
  });
  
  // Particle text effect setup
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas to full viewport size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create a very subtle background panel for better readability
    const createBackgroundPanel = () => {
      ctx.save();
      
      // Create radial gradient for a more elegant effect
      const gradientX = canvas.width / 2;
      const gradientY = canvas.height * 0.45; // Center of text area
      const innerRadius = 50;
      const outerRadius = Math.max(canvas.width, canvas.height) * 0.6;
      
      const gradient = ctx.createRadialGradient(
        gradientX, gradientY, innerRadius,
        gradientX, gradientY, outerRadius
      );
      
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
      gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    };
    
    // Setup title font
    const titleFontSize = Math.min(120, window.innerWidth / 8);
    ctx.font = `bold ${titleFontSize}px "Montserrat", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw title to sample pixels
    ctx.fillStyle = '#FFFFFF'; // White for sampling
    ctx.fillText(textRef.current.title, canvas.width / 2, canvas.height * 0.4);
    
    // Setup subtitle font
    const subtitleFontSize = Math.min(36, window.innerWidth / 25);
    ctx.font = `${subtitleFontSize}px "Montserrat", sans-serif`;
    
    // Draw subtitle to sample pixels
    ctx.fillText(textRef.current.subtitle, canvas.width / 2, canvas.height * 0.55);
    
    // Get image data to create particles
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    // Create a bitmap to track which pixels are part of text
    const textBitmap = new Uint8Array(canvas.width * canvas.height);
    
    // Clear canvas for drawing particles
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Particle settings
    const particles = [];
    const filaments = [];
    const spacing = 5; // Sample less frequently for more distinct filaments
    const particleSize = 1.8; // Smaller base particles
    
    // Color palettes for a more epic look
    const titleColors = [
      '#FFD700', // Gold
      '#FFC107', // Amber
      '#F5F5F5', // White Smoke
      '#E6C200', // Dark Gold
      '#FFFFF0'  // Ivory
    ];
    
    const subtitleColors = [
      '#F5F5F5', // White Smoke
      '#E0E0E0', // Gainsboro
      '#D4AF37', // Metallic Gold
      '#FFFFFF', // White
      '#FFFFF0'  // Ivory
    ];

    // Sample pixels to find where text is drawn
    for (let y = 0; y < canvas.height; y += spacing) {
      for (let x = 0; x < canvas.width; x += spacing) {
        const i = (y * canvas.width + x) * 4;
        const bitmapIndex = y * canvas.width + x;
        
        // If pixel has any opacity (part of the text)
        if (pixels[i + 3] > 20) {
          // Mark this pixel in our bitmap
          textBitmap[bitmapIndex] = 1;
          
          // Determine if this is title or subtitle
          const isTitle = y < canvas.height * 0.5;
          
          // Use z-value for 3D effect (-20 to 20)
          const z = (Math.random() * 40) - 20;
          
          // Choose color based on whether it's title or subtitle
          const colorPalette = isTitle ? titleColors : subtitleColors;
          const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
          
          // Create particle with 3D properties
          particles.push({
            x,
            y,
            z,  // Z-coordinate for 3D effect
            originalX: x,
            originalY: y,
            originalZ: z,
            size: particleSize * (0.8 + Math.random() * 0.6),
            speedX: (Math.random() - 0.5) * 0.2,
            speedY: (Math.random() - 0.5) * 0.2,
            speedZ: (Math.random() - 0.5) * 0.1, // Slow z-axis movement
            color,
            opacity: 0.7 + Math.random() * 0.3,
            energy: 0.5 + Math.random() * 0.5, // Energy level affects glow
            isTitle,
            effectMultiplier: isTitle ? 1.0 : 0.8,
            active: false,
            connectors: [] // Will store indices of connected particles
          });
        }
      }
    }
    
    // Create filament connections between nearby particles
    // This creates the web-like structure
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      
      // Only connect to other particles of the same type (title or subtitle)
      // and limit connections to avoid too many lines
      let connections = 0;
      const maxConnections = p1.isTitle ? 3 : 2; // More connections for title
      
      for (let j = 0; j < particles.length; j++) {
        if (i === j || connections >= maxConnections) continue;
        
        const p2 = particles[j];
        
        // Only connect particles of same type (title with title, subtitle with subtitle)
        if (p1.isTitle !== p2.isTitle) continue;
        
        // Calculate 3D distance
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dz = p1.z - p2.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // Connect if distance is within threshold
        const threshold = p1.isTitle ? 25 : 20;
        if (distance < threshold) {
          filaments.push({
            from: i,
            to: j,
            opacity: 0.5 + Math.random() * 0.3,
            thickness: 0.5 + Math.random() * 1.0,
            color: p1.color, // Inherit color from first particle
            active: false
          });
          
          p1.connectors.push(j);
          connections++;
        }
      }
    }
    
    // Animation variables
    let mouseX = 0, mouseY = 0;
    let particleAnimation;
    let time = 0;
    
    // Check if a point is within text (using the bitmap)
    const isPointInText = (x, y) => {
      // Make sure coordinates are within canvas bounds
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return false;
      
      // Check a small area around the point
      const radius = 20; 
      for (let offsetY = -radius; offsetY <= radius; offsetY++) {
        for (let offsetX = -radius; offsetX <= radius; offsetX++) {
          const checkX = Math.floor(x + offsetX);
          const checkY = Math.floor(y + offsetY);
          
          if (checkX >= 0 && checkX < canvas.width && checkY >= 0 && checkY < canvas.height) {
            const index = checkY * canvas.width + checkX;
            if (textBitmap[index]) return true;
          }
        }
      }
      
      return false;
    };
    
    // Track mouse movement
    const handleMouseMove = (e) => {
      mouseX = e.clientX - canvas.getBoundingClientRect().left;
      mouseY = e.clientY - canvas.getBoundingClientRect().top;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Function to draw a particle with 3D perspective
    const drawParticle = (p) => {
      // Apply perspective scaling
      const perspective = 800; // Perspective distance
      const scale = perspective / (perspective + p.z);
      
      // Projected coordinates with perspective
      const projectedX = p.x;
      const projectedY = p.y;
      
      // Size with perspective
      const projectedSize = p.size * scale;
      
      // Set drawing style
      ctx.globalAlpha = p.opacity * scale; // Fade with distance
      
      // Energy glow effect
      if (p.energy > 0.8 || p.active) {
        ctx.shadowBlur = p.active ? 15 : 8;
        ctx.shadowColor = p.color;
      } else {
        ctx.shadowBlur = 0;
      }
      
      ctx.fillStyle = p.color;
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(projectedX, projectedY, projectedSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Reset shadow
      ctx.shadowBlur = 0;
    };
    
    // Animation function
    const animate = () => {
      particleAnimation = requestAnimationFrame(animate);
      time += 0.01;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw subtle background panel
      //createBackgroundPanel();
      
      // Check if mouse is over text
      const mouseOverText = isPointInText(mouseX, mouseY);
      
      // Update and draw filaments first (behind particles)
      ctx.lineWidth = 1;
      
      filaments.forEach(filament => {
        const p1 = particles[filament.from];
        const p2 = particles[filament.to];
        
        // Skip invalid connections
        if (!p1 || !p2) return;
        
        // Activate filament if connected particles are active
        filament.active = p1.active || p2.active;
        
        // Calculate opacity based on activity and z-position
        const zFactor = (1000 - Math.abs(p1.z - p2.z)) / 1000;
        let lineOpacity = filament.opacity * zFactor;
        
        // Increase opacity when active
        if (filament.active) {
          lineOpacity = Math.min(1, lineOpacity * 1.5);
        }
        
        // Pulse effect
        const pulse = Math.sin(time * 2 + filament.from * 0.1) * 0.1 + 0.9;
        lineOpacity *= pulse;
        
        // Use gradient for filament
        const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        gradient.addColorStop(0, filament.color);
        gradient.addColorStop(1, p2.color);
        
        ctx.globalAlpha = lineOpacity;
        ctx.strokeStyle = gradient;
        ctx.lineWidth = filament.active ? filament.thickness * 1.5 : filament.thickness;
        
        // Draw filament
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });
      
      // Update and draw particles
      particles.forEach((p, index) => {
        // Calculate distance to mouse
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 120;
        
        // Activate particle if mouse is over text area AND close to this particle
        p.active = mouseOverText && distance < maxDistance;
        
        // Add subtle wave motion based on time
        const waveX = Math.sin(time + p.originalY * 0.01) * 2;
        const waveY = Math.cos(time + p.originalX * 0.01) * 2;
        
        // Update position based on activation state
        if (p.active) {
          // Mouse attraction effect
          const force = (1 - distance / maxDistance) * 2 * p.effectMultiplier;
          p.x += dx * force * 0.03;
          p.y += dy * force * 0.03;
          p.z += (p.isTitle ? 10 : 5) * force * 0.1; // Move toward viewer (z gets smaller)
          
          // Make active particles more energetic
          p.energy = Math.min(1, p.energy + 0.05);
        } else {
          // Return to original position with wave motion
          p.x += (p.originalX + waveX - p.x) * 0.1;
          p.y += (p.originalY + waveY - p.y) * 0.1;
          p.z += (p.originalZ - p.z) * 0.1;
          
          // Reduce energy when inactive
          p.energy *= 0.98;
        }
        
        // Draw the particle with 3D effect
        drawParticle(p);
      });
    };
    
    animate();
    
    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (particleAnimation) {
        cancelAnimationFrame(particleAnimation);
      }
    };
  }, []);
  
  // Handle window resize with debounce
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
  }, []);

  return (
    <section ref={containerRef} className="hero-section">
      <KinectBackground showGUI={false} />
      
      <canvas 
        ref={canvasRef} 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 10,
          pointerEvents: 'none'
        }}
      />
    </section>
  );
};

export default HeroSection;

