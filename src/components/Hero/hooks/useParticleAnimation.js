import { useEffect } from 'react';
import heroText from '../constants/textConfig';

const useParticleAnimation = (canvasRef) => {
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const createBackgroundPanel = () => {
      ctx.save();
      
      const gradientX = canvas.width / 2;
      const gradientY = canvas.height * 0.45;
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
    
    const titleFontSize = Math.min(120, window.innerWidth / 8);
    ctx.font = `bold ${titleFontSize}px "Montserrat", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(heroText.title, canvas.width / 2, canvas.height * 0.4);
    
    const subtitleFontSize = Math.min(36, window.innerWidth / 25);
    ctx.font = `${subtitleFontSize}px "Montserrat", sans-serif`;
    
    ctx.fillText(heroText.subtitle, canvas.width / 2, canvas.height * 0.55);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    const textBitmap = new Uint8Array(canvas.width * canvas.height);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const particles = [];
    const filaments = [];
    const spacing = 5;
    const particleSize = 1.8;
    
    const titleColors = [
      '#FFD700', '#FFC107', '#F5F5F5', '#E6C200', '#FFFFF0'
    ];
    
    const subtitleColors = [
      '#F5F5F5', '#E0E0E0', '#D4AF37', '#FFFFFF', '#FFFFF0'
    ];

    for (let y = 0; y < canvas.height; y += spacing) {
      for (let x = 0; x < canvas.width; x += spacing) {
        const i = (y * canvas.width + x) * 4;
        const bitmapIndex = y * canvas.width + x;
        
        if (pixels[i + 3] > 20) {
          textBitmap[bitmapIndex] = 1;
          
          const isTitle = y < canvas.height * 0.5;
          
          const z = (Math.random() * 40) - 20;
          
          const colorPalette = isTitle ? titleColors : subtitleColors;
          const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
          
          particles.push({
            x,
            y,
            z,
            originalX: x,
            originalY: y,
            originalZ: z,
            size: particleSize * (0.8 + Math.random() * 0.6),
            speedX: (Math.random() - 0.5) * 0.2,
            speedY: (Math.random() - 0.5) * 0.2,
            speedZ: (Math.random() - 0.5) * 0.1,
            color,
            opacity: 0.7 + Math.random() * 0.3,
            energy: 0.5 + Math.random() * 0.5,
            isTitle,
            effectMultiplier: isTitle ? 1.0 : 0.8,
            active: false,
            connectors: []
          });
        }
      }
    }
    
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      
      let connections = 0;
      const maxConnections = p1.isTitle ? 3 : 2;
      
      for (let j = 0; j < particles.length; j++) {
        if (i === j || connections >= maxConnections) continue;
        
        const p2 = particles[j];
        
        if (p1.isTitle !== p2.isTitle) continue;
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dz = p1.z - p2.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        const threshold = p1.isTitle ? 25 : 20;
        if (distance < threshold) {
          filaments.push({
            from: i,
            to: j,
            opacity: 0.5 + Math.random() * 0.3,
            thickness: 0.5 + Math.random() * 1.0,
            color: p1.color,
            active: false
          });
          
          p1.connectors.push(j);
          connections++;
        }
      }
    }
    
    let mouseX = 0, mouseY = 0;
    let particleAnimation;
    let time = 0;
    
    const isPointInText = (x, y) => {
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return false;
      
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
    
    const handleMouseMove = (e) => {
      mouseX = e.clientX - canvas.getBoundingClientRect().left;
      mouseY = e.clientY - canvas.getBoundingClientRect().top;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    const drawParticle = (p) => {
      const perspective = 800;
      const scale = perspective / (perspective + p.z);
      
      const projectedX = p.x;
      const projectedY = p.y;
      
      const projectedSize = p.size * scale;
      
      ctx.globalAlpha = p.opacity * scale;
      
      if (p.energy > 0.8 || p.active) {
        ctx.shadowBlur = p.active ? 15 : 8;
        ctx.shadowColor = p.color;
      } else {
        ctx.shadowBlur = 0;
      }
      
      ctx.fillStyle = p.color;
      
      ctx.beginPath();
      ctx.arc(projectedX, projectedY, projectedSize, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.shadowBlur = 0;
    };
    
    const animate = () => {
      particleAnimation = requestAnimationFrame(animate);
      time += 0.01;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const mouseOverText = isPointInText(mouseX, mouseY);
      
      ctx.lineWidth = 1;
      
      filaments.forEach(filament => {
        const p1 = particles[filament.from];
        const p2 = particles[filament.to];
        
        if (!p1 || !p2) return;
        
        filament.active = p1.active || p2.active;
        
        const zFactor = (1000 - Math.abs(p1.z - p2.z)) / 1000;
        let lineOpacity = filament.opacity * zFactor;
        
        if (filament.active) {
          lineOpacity = Math.min(1, lineOpacity * 1.5);
        }
        
        const pulse = Math.sin(time * 2 + filament.from * 0.1) * 0.1 + 0.9;
        lineOpacity *= pulse;
        
        const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        gradient.addColorStop(0, filament.color);
        gradient.addColorStop(1, p2.color);
        
        ctx.globalAlpha = lineOpacity;
        ctx.strokeStyle = gradient;
        ctx.lineWidth = filament.active ? filament.thickness * 1.5 : filament.thickness;
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });
      
      particles.forEach((p, index) => {
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 120;
        
        p.active = mouseOverText && distance < maxDistance;
        
        const waveX = Math.sin(time + p.originalY * 0.01) * 2;
        const waveY = Math.cos(time + p.originalX * 0.01) * 2;
        
        if (p.active) {
          const force = (1 - distance / maxDistance) * 2 * p.effectMultiplier;
          p.x += dx * force * 0.03;
          p.y += dy * force * 0.03;
          p.z += (p.isTitle ? 10 : 5) * force * 0.1;
          
          p.energy = Math.min(1, p.energy + 0.05);
        } else {
          p.x += (p.originalX + waveX - p.x) * 0.1;
          p.y += (p.originalY + waveY - p.y) * 0.1;
          p.z += (p.originalZ - p.z) * 0.1;
          
          p.energy *= 0.98;
        }
        
        drawParticle(p);
      });
    };
    
    animate();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (particleAnimation) {
        cancelAnimationFrame(particleAnimation);
      }
    };
  }, []);
  
  return null;
};

export default useParticleAnimation;
