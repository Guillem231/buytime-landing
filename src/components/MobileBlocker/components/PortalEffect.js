import React, { useEffect, useRef } from 'react';
import styles from '../MobileBlocker.module.css';

const PortalEffect = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Función para actualizar tamaño del canvas
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    // Crear efecto de portal/agujero negro con partículas
    class Particle {
      constructor() {
        this.reset();
      }
      
      reset() {
        // Posición central
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        
        // Dirección aleatoria
        this.angle = Math.random() * Math.PI * 2;
        this.radius = Math.random() * (Math.min(canvas.width, canvas.height) * 0.4);
        
        // Características
        this.size = Math.random() * 2 + 1;
        this.speed = Math.random() * 1 + 0.5;
        
        // Color dorado con variaciones
        const goldVariant = Math.random();
        if (goldVariant < 0.3) {
          // Oro brillante
          this.color = `rgba(255, 215, 0, ${Math.random() * 0.2 + 0.1})`;
        } else if (goldVariant < 0.7) {
          // Oro estándar
          this.color = `rgba(212, 175, 55, ${Math.random() * 0.2 + 0.1})`;
        } else {
          // Oro blanquecino
          this.color = `rgba(255, 248, 220, ${Math.random() * 0.2 + 0.1})`;
        }
      }
      
      update() {
        // Movimiento orbital alrededor del centro
        this.radius += this.speed * 0.2;
        
        // Calcular posición basada en ángulo y radio
        this.x = canvas.width / 2 + Math.cos(this.angle) * this.radius;
        this.y = canvas.height / 2 + Math.sin(this.angle) * this.radius;
        
        // Reducir tamaño gradualmente mientras se aleja
        this.size *= 0.99;
        
        // Reiniciar partícula cuando sale de la pantalla o se hace muy pequeña
        if (
          this.x < 0 || 
          this.x > canvas.width || 
          this.y < 0 || 
          this.y > canvas.height ||
          this.size < 0.3
        ) {
          this.reset();
        }
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Crear array de partículas
    const particles = [];
    const particleCount = 150;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Función de animación
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // Efecto de desvanecimiento para crear estelas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Actualizar y dibujar partículas
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
    };
    
    animate();
    
    // Limpiar al desmontar
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);
  
  return <canvas ref={canvasRef} className={styles.portalCanvas} />;
};

export default PortalEffect;
